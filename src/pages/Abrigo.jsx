import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './Abrigo.scss';

const Abrigo = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  
  // Estado completo com Abrigados, Voluntários e Recursos
  const [dadosAbrigo, setDadosAbrigo] = useState({
    nome: "Escola Central",
    vagasTotais: 100,
    ocupadas: 85,
    recursos: [
      { id: 1, item: "Água Mineral", qtd: "500L", status: "estavel" },
      { id: 2, item: "Colchões", qtd: "5", status: "faltando" },
      { id: 3, item: "Arroz", qtd: "200kg", status: "excesso" },
    ],
    abrigados: [
      { id: 1, nome: "Carlos Alberto", idade: 45, contato: "(11) 98888-0001" },
      { id: 2, nome: "Lucia Santos", idade: 32, contato: "(11) 97777-0002" },
    ],
    voluntarios: [
      { id: 1, nome: "Marcos Oliveira", funcao: "Cozinha", turno: "Manhã" },
      { id: 2, nome: "Ana Paula", funcao: "Saúde", turno: "Tarde" },
      { id: 3, nome: "Ricardo Alves", funcao: "Limpeza", turno: "Noite" },
    ],
    intercambio: [
      { id: 101, abrigo: "Ginásio Norte", precisa: "Arroz", qtd: "30kg" },
      { id: 102, abrigo: "Igreja Matriz", precisa: "Água", qtd: "100L" },
    ]
  });

  useEffect(() => {
    setTimeout(() => setLoading(false), 500);
  }, []);

  if (loading) return <div className="container">Carregando Dashboard...</div>;

  return (
    <div className="abrigo-dashboard">
      {/* 1. Resumo de Ocupação */}
      <header className="header-summary">
        <div className="status-card">
          <span>Capacidade Total</span>
          <strong>{dadosAbrigo.vagasTotais}</strong>
        </div>
        <div className={`status-card ${dadosAbrigo.ocupadas > 90 ? 'critical' : 'warning'}`}>
          <span>Pessoas Abrigadas</span>
          <strong>{dadosAbrigo.ocupadas}</strong>
        </div>
        <div className="status-card">
          <span>Vagas Disponíveis</span>
          <strong>{dadosAbrigo.vagasTotais - dadosAbrigo.ocupadas}</strong>
        </div>
        <div className="status-card">
          <span>Voluntários Ativos</span>
          <strong>{dadosAbrigo.voluntarios.length}</strong>
        </div>
      </header>

      <div className="main-content">
        <div className="left-column">
          {/* 2. Gestão de Abrigados */}
          <section className="section-card">
            <h3>👥 Gestão de Abrigados</h3>
            <button className="btn-checkin">+ Registrar Novo Check-in</button>
            <table>
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Idade</th>
                  <th>Contato</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {dadosAbrigo.abrigados.map(pessoa => (
                  <tr key={pessoa.id}>
                    <td>{pessoa.nome}</td>
                    <td>{pessoa.idade} anos</td>
                    <td>{pessoa.contato}</td>
                    <td><button className="btn-table">Detalhes</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          {/* 3. Gestão de Voluntários */}
          <section className="section-card" style={{ marginTop: '30px' }}>
            <h3>🤝 Gestão de Voluntários</h3>
            <button className="btn-checkin" style={{ backgroundColor: '#27ae60' }}>+ Cadastrar Voluntário</button>
            <table>
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Função</th>
                  <th>Turno</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {dadosAbrigo.voluntarios.map(vol => (
                  <tr key={vol.id}>
                    <td>{vol.nome}</td>
                    <td><span className="tag estavel" style={{ backgroundColor: '#e8f8f5', color: '#16a085' }}>{vol.funcao}</span></td>
                    <td>{vol.turno}</td>
                    <td><button className="btn-table">Remanejar</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          {/* 4. Inventário de Recursos */}
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
                {dadosAbrigo.recursos.map(item => (
                  <tr key={item.id}>
                    <td>{item.item}</td>
                    <td>{item.qtd}</td>
                    <td><span className={`tag ${item.status}`}>{item.status}</span></td>
                    <td><button className="btn-table">Atualizar</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        </div>

        <aside className="right-column">
          {/* 5. Central de Intercâmbio */}
          <section className="section-card">
            <h3>🔄 Central de Intercâmbio</h3>
            <p style={{ fontSize: '0.85rem', color: '#666', marginBottom: '15px' }}>
              Necessidades de outros abrigos próximos:
            </p>
            {dadosAbrigo.intercambio.map(req => (
              <div key={req.id} className="intercambio-item">
                <div className="info">
                  <span><strong>{req.precisa}</strong> ({req.qtd})</span>
                  <small>{req.abrigo}</small>
                </div>
                <button>Enviar Recurso</button>
              </div>
            ))}
          </section>

          {/* 6. Alertas de Logística */}
          <section className="section-card" style={{ marginTop: '20px', backgroundColor: '#fff5f5' }}>
            <h3 style={{ color: '#c0392b' }}>⚠️ Alertas Urgentes</h3>
            <ul style={{ fontSize: '0.9rem', paddingLeft: '15px' }}>
              <li>Estoque de Colchões crítico (menos de 10%).</li>
              <li>Escala de limpeza da noite sem voluntário.</li>
            </ul>
          </section>
        </aside>
      </div>
    </div>
  );
};

export default Abrigo;
