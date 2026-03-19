# ClickUp Clone - Sistema de Gerenciamento de Tarefas

Sistema completo de gerenciamento de tarefas inspirado no ClickUp, desenvolvido com Node.js, Express e MySQL.

## 📋 Índice

- [Tecnologias](#tecnologias)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Instalação](#instalação)
- [Configuração](#configuração)
- [Banco de Dados](#banco-de-dados)
- [Seed Data](#seed-data)
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

### Estrutura das Tabelas (Schema em Inglês)

#### **users**
- `id` (INT, PK, AUTO_INCREMENT)
- `name` (VARCHAR 100)
- `email` (VARCHAR 100, UNIQUE)
- `role` (ENUM: 'ADMIN', 'MANAGER', 'USER')
- `photo` (VARCHAR 255)
- `created_at` (TIMESTAMP)

#### **tasks**
- `id` (INT, PK, AUTO_INCREMENT)
- `title` (VARCHAR 255)
- `description` (TEXT)
- `type` (ENUM: 'task', 'bug', 'feature', 'improvement', 'documentation', 'test', 'design')
- `status` (VARCHAR 50)
- `priority` (ENUM: 'LOW', 'MEDIUM', 'HIGH')
- `deadline` (DATE)
- `created_at` (TIMESTAMP)

#### **tags**
- `id` (INT, PK, AUTO_INCREMENT)
- `name` (VARCHAR 50, UNIQUE)
- `created_at` (TIMESTAMP)

#### **comments**
- `id` (INT, PK, AUTO_INCREMENT)
- `task_id` (INT, FK → tasks.id)
- `user_id` (INT, FK → users.id)
- `message` (TEXT)
- `created_at` (TIMESTAMP)

#### **task_tags** (Many-to-Many)
- `id` (INT, PK, AUTO_INCREMENT)
- `task_id` (INT, FK → tasks.id)
- `tag_id` (INT, FK → tags.id)
- `created_at` (TIMESTAMP)

#### **task_assignments** (Atribuições)
- `id` (INT, PK, AUTO_INCREMENT)
- `task_id` (INT, FK → tasks.id)
- `user_id` (INT, FK → users.id)
- `assigned_at` (TIMESTAMP)

#### **ratings** (Avaliações)
- `id` (INT, PK, AUTO_INCREMENT)
- `task_id` (INT, FK → tasks.id)
- `user_id` (INT, FK → users.id)
- `rating_value` (INT 1-5)
- `created_at` (TIMESTAMP)

#### **favorites** (Favoritos)
- `id` (INT, PK, AUTO_INCREMENT)
- `user_id` (INT, FK → users.id)
- `task_id` (INT, FK → tasks.id)
- `created_at` (TIMESTAMP)

#### **attachments** (Anexos)
- `id` (INT, PK, AUTO_INCREMENT)
- `task_id` (INT, FK → tasks.id)
- `filename` (VARCHAR 255)
- `file_url` (TEXT)
- `file_size` (INT)
- `uploaded_at` (TIMESTAMP)

## 📊 Seed Data

Para popular o banco de dados com dados de teste, use o arquivo **[seed_data.sql](backend/seed_data.sql)**:

### Opção 1: MySQL Workbench (Recomendado)
1. Abrir MySQL Workbench
2. Conectar à base de dados
3. Abrir o ficheiro `backend/seed_data.sql`
4. Executar (⚡ botão Execute)

### Opção 2: Linha de Comandos
```bash
cd backend
mysql -u root -p clickup_db < seed_data.sql
```

### O que está incluído:
- ✅ 5 usuários de exemplo (Abel, Maria, João, Ana, Pedro)
- ✅ 8 tarefas com diferentes status e prioridades
- ✅ 8 comentários em tarefas
- ✅ 10 tags (frontend, backend, urgente, bug, feature, etc.)
- ✅ 15 associações entre tarefas e tags
- ✅ 9 atribuições de usuários a tarefas
- ✅ 5 avaliações de tarefas
- ✅ 8 favoritos
- ✅ 4 anexos de exemplo

Para mais detalhes, consulte **[DATABASE_SEED.md](backend/DATABASE_SEED.md)**

## 🔗 API Endpoints

### **Usuários** (`/users`)

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/users` | Lista todos os usuários |
| GET | `/users/:id` | Busca usuário por ID |
| POST | `/users` | Cria novo usuário |
| PUT | `/users/:id` | Atualiza usuário |
| DELETE | `/users/:id` | Deleta usuário |

#### Exemplo de criação de usuário:
```json
POST /users
{
  "name": "João Silva",
  "email": "joao@example.com",
  "role": "USER",
  "photo": "https://i.pravatar.cc/150"
}
```

### **Tarefas** (`/tasks`)

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/tasks` | Lista todas as tarefas |
| GET | `/tasks/:id` | Busca tarefa por ID |
| POST | `/tasks` | Cria nova tarefa |
| PUT | `/tasks/:id` | Atualiza tarefa |
| DELETE | `/tasks/:id` | Deleta tarefa |
| GET | `/tasks/:id/comments` | Lista comentários de uma tarefa |
| POST | `/tasks/:id/comments` | Adiciona comentário a uma tarefa |
| POST | `/tasks/:id/tags` | Adiciona tag a uma tarefa |

#### Exemplo de criação de tarefa:
```json
POST /tasks
{
  "title": "Implementar login",
  "description": "Criar sistema de autenticação",
  "type": "feature",
  "status": "A Fazer",
  "priority": "HIGH",
  "deadline": "2026-03-30"
}
```

### **Tags** (`/tags`)

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/tags` | Lista todas as tags |
| POST | `/tags` | Cria nova tag |
| DELETE | `/tags/:id` | Deleta tag |

#### Exemplo de criação de tag:
```json
POST /tags
{
  "name": "frontend"
}
```

### **Comentários** (`/tasks/:id/comments`)

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/tasks/:id/comments` | Lista comentários de uma tarefa |
| POST | `/tasks/:id/comments` | Cria comentário |

#### Exemplo de criação de comentário:
```json
POST /tasks/1/comments
{
  "user_id": 1,
  "message": "Estou trabalhando nesta tarefa"
}
```

### **Favoritos** (`/favorites`)

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/favorites/user/:userId` | Lista favoritos do usuário |
| POST | `/favorites` | Adiciona tarefa aos favoritos |
| DELETE | `/favorites/user/:userId/task/:taskId` | Remove dos favoritos |

#### Exemplo:
```json
POST /favorites
{
  "user_id": 1,
  "task_id": 3
}
```

### **Avaliações** (`/ratings`)

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/ratings/task/:taskId` | Lista avaliações de uma tarefa |
| POST | `/ratings/task/:taskId` | Adiciona avaliação |
| DELETE | `/ratings/:id` | Remove avaliação |

#### Exemplo:
```json
POST /ratings/task/1
{
  "user_id": 1,
  "rating_value": 5
}
```

### **Atribuições** (`/assignments`)

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/assignments/task/:taskId` | Lista usuários atribuídos |
| POST | `/assignments/task/:taskId` | Atribui usuário a tarefa |
| DELETE | `/assignments/:id` | Remove atribuição |

#### Exemplo:
```json
POST /assignments/task/1
{
  "user_id": 2
}
```

### **Anexos** (`/attachments`)

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/attachments/task/:taskId` | Lista anexos de uma tarefa |
| POST | `/attachments/task/:taskId` | Adiciona anexo |
| DELETE | `/attachments/:id` | Remove anexo |

#### Exemplo:
```json
POST /attachments/task/1
{
  "filename": "screenshot.png",
  "file_url": "data:image/png;base64,...",
  "file_size": 2048
}
```

## ✨ Funcionalidades

### 👥 Gerenciamento de Usuários
- ✅ CRUD completo de usuários
- ✅ Verificação de email único
- ✅ Sistema de roles (ADMIN, MANAGER, USER)
- ✅ Foto de perfil
- ✅ Middleware de verificação de existência

### 📋 Gerenciamento de Tarefas
- ✅ CRUD completo de tarefas
- ✅ Múltiplos tipos (task, bug, feature, improvement, documentation, test, design)
- ✅ Status personalizáveis (A Fazer, Em Progresso, Concluído, Bloqueado)
- ✅ Sistema de prioridades (LOW, MEDIUM, HIGH)
- ✅ Deadlines configuráveis
- ✅ Timestamps automáticos

### 🏷️ Sistema de Tags
- ✅ CRUD de tags
- ✅ Associação múltipla com tarefas (many-to-many)
- ✅ Busca de tarefas por tag
- ✅ Nome único por tag

### 💬 Sistema de Comentários
- ✅ Adicionar comentários em tarefas
- ✅ Associação com usuário autor
- ✅ Listagem por tarefa
- ✅ Timestamps automáticos

### ⭐ Sistema de Favoritos
- ✅ Marcar tarefas como favoritas
- ✅ Remover dos favoritos
- ✅ Listagem de favoritos por usuário
- ✅ Evita duplicatas

### 🌟 Sistema de Avaliações (Ratings)
- ✅ Avaliar tarefas de 1-5 estrelas
- ✅ Listagem de avaliações por tarefa
- ✅ Remover avaliações
- ✅ Associação usuário-tarefa

### 👤 Sistema de Atribuições
- ✅ Atribuir múltiplos usuários a tarefas
- ✅ Listagem de atribuições com dados dos usuários (JOIN)
- ✅ Remover atribuições
- ✅ Timestamps de atribuição

### 📎 Sistema de Anexos
- ✅ Upload de anexos em tarefas
- ✅ Suporte a base64 data URIs
- ✅ Armazenamento de tamanho do ficheiro
- ✅ Listagem por tarefa
- ✅ Remover anexos

### 🔄 Arquitetura
- ✅ API REST completa
- ✅ Separação em camadas (Routes → Controllers → Services)
- ✅ Conexão MySQL com pool
- ✅ CORS habilitado
- ✅ Logging de requisições
- ✅ Tratamento de erros
- ✅ Async/Await em toda aplicação

### 🎨 Frontend TypeScript
- ✅ Serviços modulares para cada entidade
- ✅ Integração completa com API REST
- ✅ Sistema de fallback offline
- ✅ Notificações de sucesso/erro
- ✅ Logging detalhado
- ✅ Interface moderna e responsiva

## 🚀 Como Executar o Projeto Completo

### 1. Configurar MySQL
```sql
CREATE DATABASE clickup_db;
USE clickup_db;
-- Executar script de criação de tabelas
-- (consultar database.sql)
```

### 2. Popular com dados de teste
```bash
# Seguir instruções em backend/DATABASE_SEED.md
mysql -u root -p clickup_db < backend/DATABASE_SEED.md
```

### 3. Iniciar Backend
```bash
cd backend
npm install
node src/app.js
# Backend rodando em http://localhost:3000
```

### 4. Compilar Frontend
```bash
cd frontend
npx tsc --skipLibCheck
# Abrir index.html no navegador
```

## 📝 Notas Técnicas

- **User ID padrão**: O frontend usa User ID 1 (configurado em `main.ts`)
- **CORS**: Habilitado para `http://localhost:3000`
- **Database**: Todas as tabelas usam `snake_case` em inglês
- **Timestamps**: MySQL `NOW()` para criação automática
- **Foreign Keys**: Configuradas com CASCADE em tabelas relacionais
- **File Upload**: Attachments podem usar base64 data URIs ou URLs externas

## 🐛 Troubleshooting

### Backend não inicia
- Verificar se MySQL está rodando
- Confirmar credenciais no arquivo `.env`
- Verificar se a porta 3000 está livre

### TypeScript não compila
```bash
cd frontend
npx tsc --skipLibCheck
```

### Dados não aparecem no frontend
- Confirmar que backend está rodando
- Abrir DevTools e verificar Network tab
- Verificar logs do backend no terminal
- Confirmar que dados existem no MySQL

## 📄 Licença

Este projeto foi desenvolvido para fins educacionais.
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
