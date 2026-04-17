import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import './Abrigo.scss';

const Abrigo = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [abrigo, setAbrigo] = useState(null);
  const [vagasEdit, setVagasEdit] = useState(0);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    
    // Verificação de segurança: Se for gestor de abrigo, só acessa o dele.
    if (!user) {
      navigate('/login');
      return;
    }

    if (user.tipo === 'abrigo' && user.abrigo_id != id) {
      alert("Você não tem permissão para gerenciar este abrigo.");
      navigate(`/abrigo/${user.abrigo_id}`);
      return;
    }

    fetchAbrigo();
  }, [id]);

  const fetchAbrigo = async () => {
    try {
      const response = await api.get(`/abrigos/${id}`);
      setAbrigo(response.data);
      setVagasEdit(response.data.ocupadas);
      setLoading(false);
    } catch (error) {
      console.error("Erro ao buscar abrigo:", error);
      setLoading(false);
    }
  };

  const handleUpdateVagas = async () => {
    try {
      await api.put(`/abrigos/${id}`, { ocupadas: vagasEdit });
      alert("Vagas atualizadas!");
      fetchAbrigo();
    } catch (error) {
      alert("Erro ao atualizar vagas.");
    }
  };

  if (loading) return <div className="container">Carregando Dashboard do Abrigo...</div>;
  if (!abrigo) return <div className="container">Abrigo não encontrado.</div>;

  return (
    <div className="abrigo-dashboard">
      <header className="admin-header-small">
        <h1>🏠 Gestão: {abrigo.nome}</h1>
        <button className="btn-table" onClick={() => navigate('/login')}>Sair</button>
      </header>

      {/* 1. Resumo de Ocupação */}
      <header className="header-summary">
        <div className="status-card">
          <span>Capacidade Total</span>
          <strong>{abrigo.vagas}</strong>
        </div>
        <div className={`status-card ${ (abrigo.ocupadas / abrigo.vagas) > 0.9 ? 'critical' : 'warning'}`}>
          <span>Pessoas Abrigadas</span>
          <strong>{abrigo.ocupadas}</strong>
        </div>
        <div className="status-card">
          <span>Vagas Disponíveis</span>
          <strong>{abrigo.vagas - abrigo.ocupadas}</strong>
        </div>
        <div className="status-card">
          <span>Ocupação</span>
          <strong>{Math.round((abrigo.ocupadas / abrigo.vagas) * 100)}%</strong>
        </div>
      </header>

      <div className="main-content">
        <div className="left-column">
          {/* 2. Controle de Vagas */}
          <section className="section-card">
            <h3>📊 Atualizar Ocupação em Tempo Real</h3>
            <div style={{ display: 'flex', gap: '20px', alignItems: 'center', marginTop: '10px' }}>
              <input 
                type="number" 
                value={vagasEdit}
                onChange={(e) => setVagasEdit(e.target.value)}
                style={{ padding: '10px', width: '100px', borderRadius: '5px', border: '1px solid #ddd' }}
              />
              <button className="btn-checkin" style={{ marginBottom: 0 }} onClick={handleUpdateVagas}>
                Confirmar Nova Ocupação
              </button>
            </div>
            <p style={{ marginTop: '15px', fontSize: '0.85rem', color: '#666' }}>
              * Utilize este campo para atualizar o número total de pessoas atualmente no abrigo.
            </p>
          </section>

          {/* 3. Recursos (Simulado por enquanto) */}
          <section className="section-card" style={{ marginTop: '30px' }}>
            <h3>📦 Inventário de Recursos</h3>
            <table>
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Qtd</th>
                  <th>Status</th>
                  <th>Ação</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Água Mineral</td>
                  <td>500L</td>
                  <td><span className="tag estavel">Estável</span></td>
                  <td><button className="btn-table">Atualizar</button></td>
                </tr>
                <tr>
                  <td>Colchões</td>
                  <td>5</td>
                  <td><span className="tag faltando">Faltando</span></td>
                  <td><button className="btn-table">Pedir ajuda</button></td>
                </tr>
              </tbody>
            </table>
          </section>
        </div>

        <aside className="right-column">
          <section className="section-card">
            <h3>📍 Localização</h3>
            <p><strong>Bairro:</strong> {abrigo.bairro}</p>
            <p><strong>Endereço:</strong> {abrigo.endereco}</p>
            <button className="btn-secondary" style={{ marginTop: '20px', width: '100%' }}>Ver no Mapa</button>
          </section>

          <section className="section-card" style={{ marginTop: '20px', backgroundColor: '#fff5f5' }}>
            <h3 style={{ color: '#c0392b' }}>⚠️ Alertas da Unidade</h3>
            <ul style={{ fontSize: '0.9rem', paddingLeft: '15px', color: '#c0392b' }}>
              { (abrigo.ocupadas / abrigo.vagas) > 0.9 && <li><strong>Capacidade quase esgotada!</strong></li> }
              <li>Solicitar reposição de kits de higiene.</li>
            </ul>
          </section>
        </aside>
      </div>
    </div>
  );
};

export default Abrigo;
