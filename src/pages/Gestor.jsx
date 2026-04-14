import React, { useState } from 'react';
import './Gestor.scss';

const Gestor = () => {
  // Mock de Abrigos para Monitoramento
  const [abrigos] = useState([
    { id: 1, nome: "Escola Central", ocupacao: 92 },
    { id: 2, nome: "Ginásio Municipal", ocupacao: 75 },
    { id: 3, nome: "Igreja da Matriz", ocupacao: 40 },
    { id: 4, nome: "Clube do Bairro Sul", ocupacao: 98 },
  ]);

  return (
    <div className="gestor-dashboard">
      <header className="admin-header">
        <h1>🛡️ Central de Comando Operacional</h1>
        <div className="status-geral">Estado de Alerta: <strong>CRÍTICO</strong></div>
      </header>

      <main className="dashboard-grid">
        {/* Bloco 1: Controle de Alertas Gerais */}
        <section className="card action-card">
          <h2>📢 Disparar Novo Alerta Geral</h2>
          <form onSubmit={(e) => e.preventDefault()}>
            <input type="text" placeholder="Título do Alerta (Ex: Evacuação Urgente)" />
            <textarea placeholder="Escreva aqui a mensagem que será enviada para todos os cidadãos..."></textarea>
            <select>
              <option value="critico">🚨 Urgência (Crítico)</option>
              <option value="medio">⚠️ Atenção (Médio)</option>
              <option value="baixo">ℹ️ Informativo (Baixo)</option>
            </select>
            <button type="submit" className="btn-alert">EMITIR ALERTA EM MASSA</button>
          </form>
        </section>

        {/* Bloco 2: Situação em Tempo Real dos Abrigos */}
        <section className="card list-card">
          <h2>🏠 Monitoramento de Abrigos</h2>
          <div className="lista-abrigos" style={{ maxHeight: '350px', overflowY: 'auto', paddingRight: '10px' }}>
            {abrigos.map(abrigo => (
              <div key={abrigo.id} className="abrigo-item">
                <div className="info">
                  <span>{abrigo.nome}</span>
                  <span>{abrigo.ocupacao}%</span>
                </div>
                <div className="progress-container">
                  <div 
                    className={`bar ${abrigo.ocupacao > 90 ? 'critical' : abrigo.ocupacao > 70 ? 'warning' : ''}`} 
                    style={{ width: `${abrigo.ocupacao}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
          <button className="btn-secondary" style={{ marginTop: '20px' }}>Ver Mapa de Calor</button>
        </section>

        {/* Bloco 3: Logística e Intercâmbios */}
        <section className="card">
          <h2>📦 Logística de Doações</h2>
          <div className="stats-info">
            Solicitações pendentes: <strong>03</strong>
          </div>
          <p style={{ color: '#666', marginBottom: '20px' }}>
            Há <strong>Arroz</strong> em excesso na Escola Central e falta no Ginásio Municipal.
          </p>
          <button className="btn-secondary">Autorizar Intercâmbios</button>
        </section>

        {/* Bloco 4: Gestão de Força de Trabalho */}
        <section className="card">
          <h2>👥 Força de Trabalho</h2>
          <div className="stats-info">
            Voluntários Disponíveis: <strong>142</strong>
          </div>
          <p style={{ color: '#666', marginBottom: '20px' }}>
            O Abrigo <strong>Clube do Bairro Sul</strong> está operando com apenas 2 voluntários.
          </p>
          <button className="btn-secondary">Alocar Equipes</button>
        </section>
      </main>
    </div>
  );
};

export default Gestor;
