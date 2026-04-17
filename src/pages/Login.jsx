import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import './Login.scss';

const Login = () => {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/login', { email, senha });
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.gestor));
      
      if (response.data.gestor.tipo === 'geral') {
        navigate('/gestor');
      } else {
        navigate(`/abrigo/${response.data.gestor.abrigo_id}`);
      }
    } catch (error) {
      setErro('E-mail ou senha incorretos.');
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>🛡️ Central de Crise</h1>
        <h2>Acesso do Gestor</h2>
        {erro && <p className="error-message">{erro}</p>}
        <form onSubmit={handleLogin}>
          <div className="input-group">
            <label>E-mail</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              placeholder="seu@email.com"
              required 
            />
          </div>
          <div className="input-group">
            <label>Senha</label>
            <input 
              type="password" 
              value={senha} 
              onChange={(e) => setSenha(e.target.value)} 
              placeholder="••••••••"
              required 
            />
          </div>
          <button type="submit" className="btn-login">Entrar</button>
        </form>
        <p className="footer-text">
          Acesso restrito a pessoal autorizado.
        </p>
      </div>
    </div>
  );
};

export default Login;
