# 💻 Frontend — TechFix (Aplicação Web React)

Esta é a aplicação cliente do **TechFix**, uma plataforma Single Page Application (SPA) desenvolvida para a gestão de ordens de serviço, agendamento de manutenções, parque de equipamentos eletrônicos e controle de clientes com segurança de dados (LGPD) em empresas de assistência técnica.

Baseada na arquitetura, design system e boas práticas do projeto de referência:
[https://github.com/gab-fran/clinica-veterinaria](https://github.com/gab-fran/clinica-veterinaria)

---

## 🎯 Visão Geral & Stack Técnica

O frontend foi projetado priorizando altíssima usabilidade, acessibilidade, modularidade de componentes e tipagem estática rigorosa para garantir a confiabilidade dos atendimentos e ordens de serviço.

### **Stack Tecnológica**
- **Biblioteca Principal**: [React 19](https://react.dev/)
- **Linguagem**: [TypeScript 5](https://www.typescriptlang.org/)
- **Ferramenta de Build & HMR**: [Vite 6](https://vitejs.dev/)
- **Biblioteca de Componentes UI**: [PrimeReact 10](https://primereact.org/) + [PrimeIcons](https://primereact.org/icons/)
- **Gerenciamento de Formulários & Validação**: [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/) + `@hookform/resolvers`
- **Roteamento**: [React Router DOM 7](https://reactrouter.com/)
- **Arquitetura de Estilização**: CSS Modules (`*.module.css`) para escopamento local e prevenção de colisões de classe CSS.

---

## 📁 Estrutura de Pastas

```text
frontend-assistencia/vite-project/
├── public/                     # Favicons e arquivos estáticos
├── src/
│   ├── assets/                 # Imagens, logotipos e ilustrações
│   ├── components/             # Componentes genéricos e reutilizáveis
│   │   ├── DeleteConfirmModal/ # Modal acessível de confirmação de exclusão
│   │   ├── DynamicForm/        # Gerador dinâmico de formulários baseados em schemas Zod
│   │   ├── DynamicList/        # Tabela e listagem paginada com ações rápidas
│   │   ├── Footer/             # Rodapé padrão do sistema
│   │   ├── NavBar/             # Barra de navegação superior com Menubar PrimeReact
│   │   └── ProtectedRoute/     # Guardiões de rotas autenticadas e perfil administrador
│   ├── enums/                  # Enums TypeScript (RoleUsuario, SituacaoAgendamento)
│   ├── pages/                  # Visualizações e telas da aplicação
│   │   ├── Entities/           # Módulos de Entidades (CRUDs do sistema)
│   │   │   ├── Cliente/        # Telas de Listagem (com busca), Cadastro e Detalhes
│   │   │   ├── Equipamento/    # Telas de Listagem, Cadastro com vínculo e Detalhes
│   │   │   ├── Agendamento/    # Telas de Listagem por data, Criação e Atualização de data
│   │   │   └── Usuario/        # Gestão de Usuários, perfis e alteração de senha
│   │   ├── LoginPage/          # Tela de Autenticação / Login com credenciais de teste
│   │   └── Main/               # Dashboard Principal / Home (Portal Deslogado e Logado)
│   ├── schemas/                # Schemas de validação Zod para os formulários
│   ├── services/               # Camada de integração HTTP com a API REST backend
│   │   ├── apiClient.ts        # Client Fetch customizado com intercepção de JWT e tratamento de erros
│   │   ├── apiConfig.ts        # Configuração base de URLs e gerenciamento de LocalStorage/Sessão
│   │   ├── authService.ts      # Serviços de Login, Registro e verificação de expiração de token
│   │   ├── clienteService.ts   # Chamadas aos endpoints de Clientes
│   │   ├── equipamentoService.ts # Chamadas aos endpoints de Equipamentos
│   │   ├── agendamentoService.ts # Chamadas aos endpoints de Agendamentos
│   │   ├── usuarioService.ts   # Chamadas aos endpoints de Usuários
│   │   └── homeService.ts      # Verificação de status do backend
│   ├── types/                  # Interfaces e Types TypeScript de DTOs e Respostas da API
│   ├── utils/                  # Formatadores (CPF, Celular, Data/Hora, Badges) e Endpoints
│   ├── App.tsx                 # Configuração de Rotas e Provedores do React Router
│   ├── index.css               # Estilos globais e tokens de cores (:root)
│   └── main.tsx                # Ponto de entrada da aplicação React
├── .env.example                # Modelo de variáveis de ambiente
├── .env                        # Variáveis de ambiente configuradas
├── package.json                # Dependências e scripts do projeto
├── tsconfig.json               # Configuração do TypeScript
└── vite.config.ts              # Configuração do Vite
```

---

## 🔑 Variáveis de Ambiente

Crie ou edite o arquivo `.env` na raiz do projeto com base no `.env.example`:

| Chave | Descrição | Valor Padrão (Dev) |
|---|---|---|
| `VITE_API_URL` | URL base da API Spring Boot backend | `http://localhost:8080` |

---

## ⚙️ Instalação e Execução

### 1. Instalação de Dependências
Certifique-se de ter o Node.js instalado. No terminal:

```bash
cd frontend-assistencia/vite-project
npm install
```

### 2. Executando em Modo Desenvolvimento
Para iniciar o servidor de desenvolvimento com Hot Module Replacement (HMR):

```bash
npm run dev
```
Acesse: `http://localhost:5173`.

### 3. Build para Produção & Linting
Para validar tipos TypeScript e gerar o bundle otimizado:

```bash
npm run build
npm run lint
```

---

## 🧪 Usuários para Teste (Seed Credentials)

Na tela de Login (`/login`) há um cartão dedicado exibindo as credenciais de teste configuradas:

| Perfil | E-mail | Senha |
|---|---|---|
| **Administrador** | `admin@email.com` | `123456789` (ou `administrador`) |
| **Funcionário** | `funcionario@email.com` | `123456789` (ou `funcionario`) |

---

## 📋 Atendimento aos Requisitos da Situação de Aprendizagem

- **Atividade 3 (Login)**: Autenticação via `POST /auth/login`, validação de erros com feedback em tela, controle de expiração de sessão com JWT e redirecionamento.
- **Atividade 4 (Principal / Home)**: Exibição do nome e perfil do usuário logado, botão de saída (logout), atalhos rápidos e acesso aos módulos de Clientes, Equipamentos, Agendamentos e Usuários.
- **Atividade 5 (Clientes)**: Listagem com paginação, busca por termo com confirmação, cadastro com persistência, edição e exclusão com confirmação em modal.
- **Atividade 6 (Equipamentos)**: Cadastro de equipamento obrigatoriamente associado a um cliente existente via select pesquisável, listagem e detalhes.
- **Atividade 7 (Agendamentos)**: Listagem de agendamentos ordenados por data de agendamento exibindo informações do cliente e do equipamento associado, além de recurso dedicado para atualização de data persistida no banco.
