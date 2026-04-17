import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import './Gestor.scss';

const Gestor = () => {
  const [abrigos, setAbrigos] = useState([]);
  const [voluntarios, setVoluntarios] = useState([]);
  const [alerta, setAlerta] = useState({ mensagem: '', nivel: 'baixo' });
  const [stats, setStats] = useState({ abrigosCriticos: 0 });
  const [showHeatMap, setShowHeatMap] = useState(false);
  const [showTeamModal, setShowTeamModal] = useState(false);
  const [selectedVol, setSelectedVol] = useState(null); 
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [resAbrigos, resVoluntarios] = await Promise.all([
        api.get('/abrigos'),
        api.get('/voluntarios')
      ]);
      setAbrigos(resAbrigos.data);
      setVoluntarios(resVoluntarios.data);
      
      const criticos = resAbrigos.data.filter(a => (a.ocupadas / a.vagas) > 0.9).length;
      setStats({ abrigosCriticos: criticos });
    } catch (error) {
      console.error("Erro ao carregar dados do gestor:", error);
    }
  };

  const handleRemanejar = async (abrigo_id) => {
    try {
      await api.put(`/voluntarios/${selectedVol.id}/remanejar`, { abrigo_id });
      alert(`${selectedVol.nome} foi remanejado para o novo abrigo.`);
      setSelectedVol(null);
      fetchData();
    } catch (error) {
      alert("Erro ao remanejar voluntário.");
    }
  };

  const handleSubmitAlerta = async (e) => {
    e.preventDefault();
    try {
      await api.post('/alertas', alerta);
      alert("Alerta emitido com sucesso para todos os cidadãos!");
      setAlerta({ mensagem: '', nivel: 'baixo' });
    } catch (error) {
      alert("Erro ao emitir alerta.");
    }
  };

  // Agrupar voluntários por abrigo de forma robusta
  const voluntByShelter = abrigos.map(abrigo => ({
    id: abrigo.id,
    nome: abrigo.nome,
    membros: voluntarios.filter(v => v.abrigo_id === abrigo.id)
  }));

  return (
    <div className="gestor-dashboard">
      <header className="admin-header">
        <div className="header-content">
          <h1>🛡️ Central de Comando Operacional</h1>
          <button className="btn-logout" onClick={() => navigate('/login')}>Sair</button>
        </div>
        <div className="status-geral">
          Estado de Alerta: <strong className={stats.abrigosCriticos > 0 ? 'critical' : ''}>
            {stats.abrigosCriticos > 0 ? 'CRÍTICO' : 'ESTÁVEL'}
          </strong>
        </div>
      </header>

      <main className="dashboard-grid">
        <section className="card action-card">
          <h2>📢 Disparar Novo Alerta Geral</h2>
          <form onSubmit={handleSubmitAlerta}>
            <textarea 
              placeholder="Escreva aqui a mensagem que será enviada para todos os cidadãos..."
              value={alerta.mensagem}
              onChange={(e) => setAlerta({...alerta, mensagem: e.target.value})}
              required
            ></textarea>
            <select 
              value={alerta.nivel}
              onChange={(e) => setAlerta({...alerta, nivel: e.target.value})}
            >
              <option value="critico">🚨 Urgência (Crítico)</option>
              <option value="medio">⚠️ Atenção (Médio)</option>
              <option value="baixo">ℹ️ Informativo (Baixo)</option>
            </select>
            <button type="submit" className="btn-alert">EMITIR ALERTA EM MASSA</button>
          </form>
        </section>

        <section className="card list-card">
          <h2>🏠 Monitoramento de Abrigos</h2>
          <div className="lista-abrigos" style={{ maxHeight: '350px', overflowY: 'auto', paddingRight: '10px' }}>
            {abrigos.map(abrigo => {
              const ocupacao = Math.round((abrigo.ocupadas / abrigo.vagas) * 100);
              return (
                <div key={abrigo.id} className="abrigo-item">
                  <div className="info">
                    <span>{abrigo.nome}</span>
                    <span>{ocupacao}%</span>
                  </div>
                  <div className="progress-container">
                    <div 
                      className={`bar ${ocupacao > 90 ? 'critical' : ocupacao > 70 ? 'warning' : ''}`} 
                      style={{ width: `${ocupacao}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
          <button className="btn-secondary" style={{ marginTop: '20px' }} onClick={() => setShowHeatMap(true)}>
            Ver Mapa de Calor
          </button>
        </section>

        <section className="card">
          <h2>⚙️ Administração</h2>
          <div className="stats-info">
            Gestores ativos: <strong>--</strong>
          </div>
          <p style={{ color: '#666', marginBottom: '20px' }}>
            Acesse o painel de controle para cadastrar novos gestores ou gerenciar unidades.
          </p>
          <button className="btn-primary" onClick={() => navigate('/cadastro')}>CADASTRAR NOVO GESTOR</button>
        </section>

        <section className="card">
          <h2>👥 Força de Trabalho</h2>
          <div className="stats-info">
            Voluntários Ativos: <strong>{voluntarios.length}</strong>
          </div>
          <p style={{ color: '#666', marginBottom: '20px' }}>
            Gerencie a distribuição de voluntários entre os abrigos ativos.
          </p>
          <button className="btn-secondary" onClick={() => setShowTeamModal(true)}>Alocar Equipes</button>
        </section>
      </main>

      {showHeatMap && (
        <div className="modal-overlay" onClick={() => setShowHeatMap(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <header className="modal-header">
              <h2>🔥 Mapa de Calor de Ocupação</h2>
              <button className="btn-close" onClick={() => setShowHeatMap(false)}>&times;</button>
            </header>
            <div className="heat-map-grid">
              {abrigos.map(abrigo => {
                const ocupacao = Math.round((abrigo.ocupadas / abrigo.vagas) * 100);
                let statusClass = 'low';
                if (ocupacao > 90) statusClass = 'critical';
                else if (ocupacao > 70) statusClass = 'warning';
                return (
                  <div key={abrigo.id} className={`heat-card ${statusClass}`}>
                    <div className="heat-header">
                      <strong>{abrigo.nome}</strong>
                      <span className="badge">{ocupacao}%</span>
                    </div>
                    <div className="heat-body">
                      <p>{abrigo.bairro}</p>
                      <small>{abrigo.ocupadas} de {abrigo.vagas} vagas ocupadas</small>
                    </div>
                  </div>
                );
              })}
            </div>
            <footer className="modal-footer">
              <button className="btn-primary" onClick={() => setShowHeatMap(false)}>Fechar Painel</button>
            </footer>
          </div>
        </div>
      )}

      {showTeamModal && (
        <div className="modal-overlay" onClick={() => setShowTeamModal(false)}>
          <div className="modal-content team-modal" onClick={(e) => e.stopPropagation()}>
            <header className="modal-header">
              <h2>👥 Gestão de Equipes e Voluntariado</h2>
              <button className="btn-close" onClick={() => setShowTeamModal(false)}>&times;</button>
            </header>
            
            <div className="modal-body-scroll">
              {voluntByShelter.length > 0 ? voluntByShelter.map(grupo => (
                <div key={grupo.id} className="shelter-team-group">
                  <h3>🏢 {grupo.nome}</h3>
                  <div className="volunt-list">
                    {grupo.membros.length > 0 ? grupo.membros.map(vol => (
                      <div key={vol.id} className="volunt-item">
                        <div className="vol-info">
                          <strong>{vol.nome}</strong>
                          <span>{vol.area}</span>
                        </div>
                        <button className="btn-remanejar" onClick={() => setSelectedVol(vol)}>
                          Remanejar
                        </button>
                      </div>
                    )) : <p className="empty-msg">Nenhum voluntário alocado neste abrigo.</p>}
                  </div>
                </div>
              )) : <p className="empty-msg">Nenhum abrigo cadastrado.</p>}
            </div>

            {selectedVol && (
              <div className="remanejar-popover">
                <div className="popover-content">
                  <h4>Remanejar: {selectedVol.nome}</h4>
                  <p>Escolha o abrigo de destino:</p>
                  <div className="shelter-options">
                    {abrigos.filter(a => a.id !== selectedVol.abrigo_id).map(a => (
                      <button key={a.id} onClick={() => handleRemanejar(a.id)}>
                        {a.nome}
                      </button>
                    ))}
                  </div>
                  <button className="btn-cancel" onClick={() => setSelectedVol(null)}>Cancelar</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Gestor;
