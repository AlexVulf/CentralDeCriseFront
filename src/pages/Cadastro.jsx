import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import './Cadastro.scss';

const Cadastro = () => {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    senha: '',
    tipo: 'geral',
    abrigo_id: ''
  });
  const [abrigos, setAbrigos] = useState([]);
  const [status, setStatus] = useState({ type: '', message: '' });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAbrigos = async () => {
      try {
        const response = await api.get('/abrigos');
        setAbrigos(response.data);
      } catch (error) {
        console.error("Erro ao carregar abrigos:", error);
      }
    };
    fetchAbrigos();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/cadastro', formData);
      setStatus({ type: 'success', message: 'Gestor cadastrado com sucesso!' });
      setTimeout(() => navigate('/gestor'), 2000);
    } catch (error) {
      setStatus({ type: 'error', message: 'Erro ao cadastrar gestor.' });
    }
  };

  return (
    <div className="cadastro-container">
      <div className="cadastro-card">
        <h1>👤 Novo Gestor</h1>
        <p>Cadastre aqui novos administradores ou gestores de abrigos específicos.</p>
        
        {status.message && (
          <div className={`status-msg ${status.type}`}>{status.message}</div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Nome Completo</label>
            <input type="text" name="nome" onChange={handleChange} required />
          </div>
          <div className="input-group">
            <label>E-mail</label>
            <input type="email" name="email" onChange={handleChange} required />
          </div>
          <div className="input-group">
            <label>Senha Provisória</label>
            <input type="password" name="senha" onChange={handleChange} required />
          </div>
          <div className="input-group">
            <label>Tipo de Acesso</label>
            <select name="tipo" value={formData.tipo} onChange={handleChange}>
              <option value="geral">Administrador Geral</option>
              <option value="abrigo">Gestor de Abrigo</option>
            </select>
          </div>

          {formData.tipo === 'abrigo' && (
            <div className="input-group">
              <label>Vincular ao Abrigo</label>
              <select name="abrigo_id" onChange={handleChange} required>
                <option value="">Selecione um abrigo...</option>
                {abrigos.map(abrigo => (
                  <option key={abrigo.id} value={abrigo.id}>{abrigo.nome}</option>
                ))}
              </select>
            </div>
          )}

          <div className="actions">
            <button type="button" className="btn-secondary" onClick={() => navigate('/gestor')}>Voltar</button>
            <button type="submit" className="btn-primary">Finalizar Cadastro</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Cadastro;
