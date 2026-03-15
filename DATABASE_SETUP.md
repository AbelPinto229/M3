# API ClickUP com MySQL 🗄️

A API agora está integrada com **MySQL** para persistência de dados!

## 🚀 Requisitos

- **Node.js** (versão 14 ou superior)
- **MySQL** (versão 5.7 ou superior)
- **npm** ou **yarn**

## 📥 Instalação do MySQL

### Windows
1. Download: https://dev.mysql.com/downloads/mysql/
2. Execute o instalador
3. Durante a instalação, defina:
   - **MySQL Server Port**: 3306 (padrão)
   - **Username**: root
   - **Password**: root (ou o que preferir)

### macOS
```bash
brew install mysql
brew services start mysql
```

### Linux (Ubuntu/Debian)
```bash
sudo apt-get install mysql-server
sudo service mysql start
```

## 🔧 Configuração

### 1. Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```bash
# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=root
DB_NAME=projetom3
DB_PORT=3306

# Server Configuration
NODE_ENV=development
PORT=3000
```

**⚠️ Altere `DB_PASSWORD` se usou outra senha no MySQL**

### 2. Instalar Dependências

```bash
npm install
```

Isto instalará:
- `express` - Framework web
- `sequelize` - ORM para MySQL
- `mysql2` - Driver MySQL
- `dotenv` - Gerenciamento de variáveis

### 3. Criar Base de Dados (Opcional)

Se a base de dados não for criada automaticamente:

```bash
mysql -u root -p
```

Depois execute:

```sql
CREATE DATABASE projetom3;
EXIT;
```

## ▶️ Iniciar o Servidor

```bash
node server.js
```

Você verá:

```
Base de dados sincronizada com sucesso!
Servidor ClickUP API em http://localhost:3000
```

## 📊 Estrutura do Banco de Dados

### Tabela `users`
| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | INT | Chave primária (auto-incremento) |
| nome | VARCHAR(255) | Nome do utilizador |
| email | VARCHAR(255) | Email único |
| ativo | BOOLEAN | Status (true/false) |
| createdAt | DATETIME | Data de criação |
| updatedAt | DATETIME | Data de atualização |

### Tabela `tasks`
| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | INT | Chave primária (auto-incremento) |
| titulo | VARCHAR(255) | Título da tarefa |
| categoria | VARCHAR(100) | Categoria |
| concluida | BOOLEAN | Status de conclusão |
| responsavelNome | VARCHAR(255) | Responsável |
| dataConclusao | DATE | Data de conclusão |
| createdAt | DATETIME | Data de criação |
| updatedAt | DATETIME | Data de atualização |

## 🧪 Testar API

### Listar Utilizadores
```bash
curl http://localhost:3000/users
```

### Criar Utilizador
```bash
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{"nome":"João Silva","email":"joao@example.com"}'
```

### Listar Tarefas
```bash
curl http://localhost:3000/tasks
```

### Criar Tarefa
```bash
curl -X POST http://localhost:3000/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "titulo":"Estudar Node.js",
    "categoria":"trabalho",
    "responsavelNome":"João Silva"
  }'
```

## 🔍 Verificar Dados no MySQL

```bash
mysql -u root -p
USE projetom3;
SELECT * FROM users;
SELECT * FROM tasks;
EXIT;
```

## 📁 Estrutura do Projeto

```
PROJETOM3/
├── config/
│   └── database.js          # Configuração Sequelize
├── models/
│   ├── User.js              # Modelo de utilizador
│   └── Task.js              # Modelo de tarefa
├── services/
│   ├── userService.js       # Lógica com Sequelize
│   └── taskService.js       # Lógica com Sequelize
├── controllers/
│   ├── userController.js    # Endpoints de utilizador
│   └── taskController.js    # Endpoints de tarefa
├── middlewares/
│   └── checkUserExists.js   # Validação
├── server.js                # Servidor principal
├── .env                      # Variáveis de ambiente
└── package.json             # Dependências
```

## ✨ Vantagens do MySQL

✅ **Persistência**: Dados salvos permanentemente
✅ **Escalabilidade**: Suporta muitos registros
✅ **Confiabilidade**: ACID transactions
✅ **Segurança**: Validações em nível DB
✅ **Performance**: Índices otimizados

## 🐛 Troubleshooting

### Erro: "Connection refused"
```
Solução: Certifique-se que MySQL está a rodar:
- Windows: Services > MySQL80
- macOS: brew services start mysql
- Linux: sudo service mysql start
```

### Erro: "Access denied for user"
```
Solução: Verifique as credenciais no .env
- DB_USER deve ser 'root' (ou o utilizador que criou)
- DB_PASSWORD deve ser a senha correta
```

### Erro: "ER_BAD_DB_ERROR"
```
Solução: A base de dados será criada automaticamente
Se não conseguir, crie manualmente via MySQL CLI
```

## 📚 Documentação Completa

Para mais informações sobre endpoints, veja:
- `DOCUMENTACAO.md` - Detalhes de cada endpoint
- `API_README.md` - Exemplos com curl

---

**Agora é um Full Stack Completo!** 🎉

Frontend (index.html) + Backend (Express) + Database (MySQL)
