# ClickUp Clone - Sistema de Gerenciamento de Tarefas

Sistema completo de gerenciamento de tarefas inspirado no ClickUp, desenvolvido com Node.js, Express e MySQL.

## 📋 Índice

- [Tecnologias](#tecnologias)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Instalação](#instalação)
- [Configuração](#configuração)
- [Banco de Dados](#banco-de-dados)
- [API Endpoints](#api-endpoints)
- [Funcionalidades](#funcionalidades)

## 🚀 Tecnologias

- **Backend**: Node.js + Express
- **Banco de Dados**: MySQL
- **Frontend**: TypeScript
- **Gerenciamento de Ambiente**: dotenv

## 📁 Estrutura do Projeto

```
PROJETOM3/
├── backend/
│   ├── src/
│   │   ├── controllers/     # Controladores da API
│   │   ├── services/        # Lógica de negócio
│   │   ├── routes/          # Definição de rotas
│   │   ├── middlewares/     # Middlewares customizados
│   │   ├── app.js          # Arquivo principal
│   │   └── db.js           # Configuração do banco
│   ├── .env                # Variáveis de ambiente
│   ├── database.sql        # Script SQL
│   └── package.json
└── frontend/
    └── src/                # Código TypeScript do frontend
```

## 💻 Instalação

### Backend

```bash
cd backend
npm install
```

### Dependências instaladas:
- `express` - Framework web
- `mysql2` - Driver MySQL
- `dotenv` - Gerenciamento de variáveis de ambiente
- `nodemon` - Auto-reload em desenvolvimento

## ⚙️ Configuração

### 1. Configurar variáveis de ambiente

O arquivo `.env` está na raiz do backend:

```env
# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=root
DB_NAME=clickup
DB_PORT=3306

# Server Configuration
NODE_ENV=development
PORT=3000
```

**⚠️ Importante**: O arquivo `.env` está no `.gitignore` e não será commitado.

### 2. Executar o servidor

```bash
npm start
```

O servidor iniciará em: `http://localhost:3000`

## 🗄️ Banco de Dados

### Criar a base de dados

Execute o arquivo `database.sql` no MySQL:

```bash
mysql -u root -p < database.sql
```

Ou importe manualmente no MySQL Workbench/phpMyAdmin.

### Estrutura das Tabelas

#### **users**
- `id` (INT, PK, AUTO_INCREMENT)
- `name` (VARCHAR)
- `email` (VARCHAR, UNIQUE)
- `status` (ENUM: 'ativo', 'inativo')
- `createdAt` (TIMESTAMP)

#### **tasks**
- `id` (INT, PK, AUTO_INCREMENT)
- `title` (VARCHAR)
- `description` (TEXT)
- `status` (ENUM: 'pendente', 'em_progresso', 'concluida', 'cancelada')
- `priority` (ENUM: 'baixa', 'media', 'alta', 'urgente')
- `assignedUserId` (INT, FK)
- `createdAt` (TIMESTAMP)
- `updatedAt` (TIMESTAMP)

#### **tags**
- `id` (INT, PK, AUTO_INCREMENT)
- `name` (VARCHAR, UNIQUE)
- `color` (VARCHAR)
- `createdAt` (TIMESTAMP)

#### **comments**
- `id` (INT, PK, AUTO_INCREMENT)
- `taskId` (INT, FK)
- `userId` (INT, FK)
- `conteudo` (TEXT)
- `createdAt` (TIMESTAMP)

#### **task_tags** (Tabela de relação Many-to-Many)
- `taskId` (INT, FK)
- `tagId` (INT, FK)
- `createdAt` (TIMESTAMP)

## 🔗 API Endpoints

### **Usuários** (`/users`)

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/users` | Lista todos os usuários (com filtros opcionais) |
| GET | `/users/:id` | Busca usuário por ID |
| GET | `/users/stats` | Retorna estatísticas de usuários |
| POST | `/users` | Cria novo usuário |
| PUT | `/users/:id` | Atualiza usuário |
| PATCH | `/users/:id` | Alterna status (ativo/inativo) |
| DELETE | `/users/:id` | Deleta usuário |

#### Exemplo de criação de usuário:
```json
POST /users
{
  "name": "João Silva",
  "email": "joao@example.com",
  "status": "ativo"
}
```

### **Tarefas** (`/tasks`)

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/tasks` | Lista todas as tarefas (com filtros) |
| GET | `/tasks/stats` | Retorna estatísticas de tarefas |
| POST | `/tasks` | Cria nova tarefa |
| PUT | `/tasks/:id` | Atualiza tarefa |
| DELETE | `/tasks/:id` | Deleta tarefa |
| POST | `/tasks/:id/tags` | Adiciona tag a uma tarefa |
| GET | `/tasks/:id/comments` | Lista comentários de uma tarefa |
| POST | `/tasks/:id/comments` | Adiciona comentário a uma tarefa |

#### Exemplo de criação de tarefa:
```json
POST /tasks
{
  "title": "Implementar login",
  "description": "Criar sistema de autenticação",
  "status": "pendente",
  "priority": "alta",
  "assignedUserId": 1
}
```

#### Exemplo de filtros:
```
GET /tasks?status=em_progresso&priority=alta&assignedUserId=1
```

### **Tags** (`/tags`)

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/tags` | Lista todas as tags |
| POST | `/tags` | Cria nova tag |
| DELETE | `/tags/:id` | Deleta tag |
| GET | `/tags/:id/tasks` | Lista tarefas com essa tag |

#### Exemplo de criação de tag:
```json
POST /tags
{
  "name": "Bug",
  "color": "#e74c3c"
}
```

### **Comentários**

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/tasks/:id/comments` | Lista comentários de uma tarefa |
| POST | `/tasks/:id/comments` | Cria comentário em uma tarefa |

#### Exemplo de criação de comentário:
```json
POST /tasks/1/comments
{
  "userId": 2,
  "conteudo": "Estou trabalhando nesta tarefa"
}
```

## ✨ Funcionalidades

### Gerenciamento de Usuários
- ✅ CRUD completo de usuários
- ✅ Verificação de email único
- ✅ Status ativo/inativo
- ✅ Estatísticas de usuários
- ✅ Middleware de verificação de existência

### Gerenciamento de Tarefas
- ✅ CRUD completo de tarefas
- ✅ Filtros por status, prioridade e usuário atribuído
- ✅ Associação com usuários
- ✅ Sistema de tags (many-to-many)
- ✅ Sistema de comentários
- ✅ Estatísticas de tarefas
- ✅ Timestamps automáticos (createdAt, updatedAt)

### Sistema de Tags
- ✅ CRUD de tags
- ✅ Cores customizáveis
- ✅ Associação múltipla com tarefas
- ✅ Listagem de tarefas por tag

### Sistema de Comentários
- ✅ Adicionar comentários em tarefas
- ✅ Associação com usuário autor
- ✅ Listagem por tarefa
- ✅ Cascade delete

### Recursos Técnicos
- ✅ Arquitetura em camadas (Controllers, Services, Routes)
- ✅ Middlewares customizados
- ✅ Variáveis de ambiente seguras
- ✅ Relacionamentos com Foreign Keys
- ✅ Índices para otimização de queries
- ✅ Validações e tratamento de erros

## 🛡️ Segurança

- Arquivo `.env` incluído no `.gitignore`
- Credenciais não expostas no código
- Validações de entrada nos middlewares

## 📝 Notas

- O servidor usa `nodemon` em desenvolvimento para auto-reload
- As variáveis de ambiente são carregadas automaticamente via `dotenv/config`
- O banco de dados inclui dados de exemplo para testes
- Todas as foreign keys têm ações ON DELETE definidas

## 🤝 Contribuindo

1. Faça um fork do projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

---

**Desenvolvido para o Módulo 3** 🚀
