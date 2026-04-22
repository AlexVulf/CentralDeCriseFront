# 🎨 Central de Crise - Frontend

Interface interativa desenvolvida para facilitar o acesso à informação e a gestão de recursos em momentos de crise.

---

## 🛠️ Tecnologias e Dependências
- **React 19**: Versão mais recente para máxima performance.
- **Vite**: Build tool extremamente rápida.
- **SASS (Dart Sass)**: Para estilos modulares e variáveis.
- **React Router DOM 7**: Gerenciamento de rotas e navegação.
- **Axios**: Cliente HTTP para comunicação com o backend.

---

## ⚙️ Instalação e Uso

1. Entre na pasta do frontend:
   ```bash
   cd Front
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

A aplicação abrirá no navegador em `http://localhost:5173`.

---

## 📱 Páginas Principais
- **`/` (Cidadão)**: Painel público com busca de abrigos, alertas críticos e busca de desaparecidos.
- **`/login`**: Acesso restrito para gestores.
- **`/gestor`**: Painel do Administrador Central (Mapa de calor, gestão de voluntários e emissão de alertas).
- **`/abrigo/:id`**: Gestão específica de uma unidade de acolhimento (Ocupação e Inventário).

---

## 🎨 Padronização Visual
O projeto utiliza **SASS** com arquivos específicos para cada página, garantindo que o estilo seja modular e fácil de manter.
- Global: `src/styles/global.scss`
- Componentes/Páginas: Localizados junto aos seus respectivos arquivos `.jsx`.
