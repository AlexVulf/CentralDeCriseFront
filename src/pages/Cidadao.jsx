import React, { useState, useEffect } from 'react';
import api from '../services/api';
import './Cidadao.scss';

const Cidadao = () => {
  const [abrigos, setAbrigos] = useState([]);
  const [alertas, setAlertas] = useState([]);
  const [desaparecidos, setDesaparecidos] = useState([]);
  const [busca, setBusca] = useState('');
  const [buscaPessoa, setBuscaPessoa] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Mock de dados para visualização inicial
        setAbrigos([
          { id: 1, nome: 'Escola Central', bairro: 'Centro', vagas: 50, ocupadas: 35, endereco: 'Rua das Flores, 123' },
          { id: 2, nome: 'Ginásio Municipal', bairro: 'Norte', vagas: 100, ocupadas: 90, endereco: 'Av. Brasil, 500' }
        ]);

        setAlertas([{ id: 1, mensagem: 'ALERTA CRÍTICO: Risco de alagamento na região Sul. Procure abrigo.', nivel: 'high' }]);
        
        setDesaparecidos([
          { id: 1, nome: 'João Silva', status: 'procurado', foto: 'https://via.placeholder.com/50' },
          { id: 2, nome: 'Maria Oliveira', status: 'encontrado', foto: 'https://via.placeholder.com/50' }
        ]);
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="cidadao-page">
      {/* 1. Header de Alerta */}
      {alertas.map(alerta => (
        <div key={alerta.id} className="alerta-banner">
          ⚠️ {alerta.mensagem}
        </div>
      ))}

      {/* 2. Área de Buscas */}
      <div className="container-buscas">
        <div className="busca-item">
          <input 
            type="text" 
            placeholder="Digite seu bairro para encontrar o abrigo mais próximo..." 
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
          <button>Buscar Abrigo</button>
        </div>

        <div className="busca-item">
          <input 
            type="text" 
            placeholder="Digite o nome de um familiar ou amigo desaparecido..." 
            value={buscaPessoa}
            onChange={(e) => setBuscaPessoa(e.target.value)}
          />
          <button className="btn-search-person">Buscar Pessoa</button>
        </div>
      </div>

      <div className="grid-info">
        {/* 3. Módulo de Abrigos */}
        <section className="card">
          <h3>🏘️ Abrigos de Referência</h3>
          {abrigos.map(abrigo => (
            <div key={abrigo.id} className="item-lista-container" style={{ marginBottom: '15px' }}>
              <div className="item-lista">
                <div>
                  <strong>{abrigo.nome}</strong>
                  <p><small>{abrigo.endereco}</small></p>
                </div>
                <span>{abrigo.vagas - abrigo.ocupadas} vagas</span>
              </div>
              <div className="progress-bar">
                <div 
                  className="fill" 
                  style={{ width: `${(abrigo.ocupadas / abrigo.vagas) * 100}%` }}
                ></div>
              </div>
            </div>
          ))}
          <button className="btn-acao">Ver rota no Mapa</button>
        </section>

        {/* 4. Módulo de Doações */}
        <section className="card">
          <h3>📦 Doações Necessárias</h3>
          <div className="item-lista">
            <span>🚨 <strong>Prioridade Máxima:</strong></span>
            <span>Água, Leite, Fraldas G</span>
          </div>
          <div className="item-lista">
            <span>✅ <strong>Não Necessário:</strong></span>
            <span>Roupas de Verão</span>
          </div>
          <button className="btn-acao secundario">Quero doar</button>
        </section>

        {/* 5. Módulo de Desaparecidos */}
        <section className="card">
          <h3>🔍 Desaparecidos</h3>
          <div className="galeria-mini">
            {desaparecidos.map(pessoa => (
              <div key={pessoa.id} className="item-lista">
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <img src={pessoa.foto} alt={pessoa.nome} style={{ borderRadius: '50%' }} />
                  <span>{pessoa.nome}</span>
                </div>
                <span className={`status-tag ${pessoa.status}`}>{pessoa.status}</span>
              </div>
            ))}
          </div>
          <button className="btn-acao">Tenho informações</button>
        </section>

        {/* 6. Módulo de Voluntariado */}
        <section className="card">
          <h3>🤝 Seja um Voluntário</h3>
          <p>Precisamos de ajuda urgente na <strong>Cozinha</strong> e <strong>Limpeza</strong> do Abrigo Central.</p>
          <button className="btn-acao">Quero me voluntariar</button>
        </section>
      </div>
    </div>
  );
};

export default Cidadao;
