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
        const [resAbrigos, resAlertas, resDesaparecidos] = await Promise.all([
          api.get('/abrigos'),
          api.get('/alertas'),
          api.get('/desaparecidos')
        ]);

        setAbrigos(resAbrigos.data);
        setAlertas(resAlertas.data);
        setDesaparecidos(resDesaparecidos.data);
      } catch (error) {
        console.error("Erro ao buscar dados reais:", error);
      }
    };

    fetchData();
  }, []);

  // Filtragem básica local
  const abrigosFiltrados = abrigos.filter(a => 
    a.bairro?.toLowerCase().includes(busca.toLowerCase()) || 
    a.nome?.toLowerCase().includes(busca.toLowerCase())
  );

  const pessoasFiltradas = desaparecidos.filter(p => 
    p.nome?.toLowerCase().includes(buscaPessoa.toLowerCase())
  );

  return (
    <div className="cidadao-page">
      {/* 1. Header de Alerta */}
      {alertas.length > 0 && alertas.map(alerta => (
        <div key={alerta.id} className={`alerta-banner ${alerta.nivel}`}>
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
          {abrigosFiltrados.length > 0 ? abrigosFiltrados.map(abrigo => (
            <div key={abrigo.id} className="item-lista-container" style={{ marginBottom: '15px' }}>
              <div className="item-lista">
                <div>
                  <strong>{abrigo.nome}</strong>
                  <p><small>{abrigo.endereco} - {abrigo.bairro}</small></p>
                </div>
                <span>{abrigo.vagas - abrigo.ocupadas} vagas</span>
              </div>
              <div className="progress-bar">
                <div 
                  className={`fill ${ (abrigo.ocupadas/abrigo.vagas) > 0.9 ? 'critical' : '' }`}
                  style={{ width: `${(abrigo.ocupadas / abrigo.vagas) * 100}%` }}
                ></div>
              </div>
            </div>
          )) : <p>Nenhum abrigo encontrado nesta região.</p>}
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
            {pessoasFiltradas.length > 0 ? pessoasFiltradas.map(pessoa => (
              <div key={pessoa.id} className="item-lista">
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <img src={pessoa.foto || 'https://via.placeholder.com/50'} alt={pessoa.nome} style={{ borderRadius: '50%', width: '40px' }} />
                  <span>{pessoa.nome}</span>
                </div>
                <span className={`status-tag ${pessoa.status}`}>{pessoa.status}</span>
              </div>
            )) : <p>Nenhuma pessoa encontrada.</p>}
          </div>
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
