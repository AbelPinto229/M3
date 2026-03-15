# API ClickUP - Gestão de Utilizadores e Tarefas

Uma API Node.js/Express para gerenciar utilizadores e tarefas com operações CRUD completas, validações, ordenação, pesquisa e estatísticas.

Este documento descreve a API RESTful implementada, não a aplicação web TypeScript.

## 🚀 Quick Start

### Instalar Dependências
```bash
npm install
```

### Iniciar o Servidor
```bash
node server.js
```

O servidor estará disponível em: **http://localhost:3000**

## 📚 Documentação

- **[DOCUMENTACAO.md](./DOCUMENTACAO.md)** - Documentação completa de todos os endpoints
- **[RESUMO.md](./RESUMO.md)** - Resumo da implementação e arquitetura

## 🎯 13 Exercícios Implementados

### Exercício 1 - Criar Lista de Utilizadores
```bash
GET /users
```
Retorna todos os utilizadores com opções de sorting e search.

### Exercício 2 - Criar Novo Utilizador
```bash
POST /users
Body: { "nome": "Daniel", "email": "daniel@example.com" }
```

### Exercício 3 - Atualizar Utilizador
```bash
PUT /users/:id
Body: { "nome": "...", "email": "...", "ativo": true/false }
```

### Exercício 4 - Alternar Ativo/Inativo
```bash
PATCH /users/:id
```
Alterna automaticamente o status ativo/inativo.

### Exercício 5 - Remover Utilizador
```bash
DELETE /users/:id
```

### Exercício 6 - Criar Lista de Tarefas
```bash
GET /tasks
```
Retorna todas as tarefas com opções de sorting e search.

### Exercício 7 - Criar Nova Tarefa
```bash
POST /tasks
Body: { "titulo": "...", "categoria": "...", "responsavelNome": "..." }
```

### Exercício 8 - Atualizar Tarefa
```bash
PUT /tasks/:id
Body: { "titulo": "...", "categoria": "...", "concluida": true/false }
```
Quando `concluida` é true, `dataConclusao` é automaticamente preenchida.

### Exercício 9 - Remover Tarefa
```bash
DELETE /tasks/:id
```

### Exercício 10 - Ordenar Listas
```bash
GET /users?sort=asc|desc
GET /tasks?sort=asc|desc
```

### Exercício 11 - Pesquisa
```bash
GET /users?search=nome
GET /tasks?search=titulo
```

### Exercício 12 - Estatísticas
```bash
GET /users/stats
# Resposta: { "total": 3, "ativos": 2, "percentagem": 66.67 }

GET /tasks/stats
# Resposta: { "total": 2, "pendentes": 1, "concluidas": 1 }
```

### Exercício 13 - Middleware checkUserExists
```javascript
// Localizado em middlewares/checkUserExists.js
export const checkUserExists = (req, res, next) => {
  const userId = req.params.id;
  const user = userService.getUserById(userId);

  if (!user) {
    return res.status(404).json({ error: "Utilizador não encontrado" });
  }

  req.user = user;
  next();
};
```

## 📡 Exemplos de Requisições

### Listar Utilizadores
```bash
curl http://localhost:3000/users
```

### Listar Utilizadores Ordenados (Descendente)
```bash
curl http://localhost:3000/users?sort=desc
```

### Pesquisar Utilizadores
```bash
curl http://localhost:3000/users?search=Joao
```

### Criar Novo Utilizador
```bash
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{"nome":"Ana Silva","email":"ana@example.com"}'
```

### Atualizar Utilizador
```bash
curl -X PUT http://localhost:3000/users/1 \
  -H "Content-Type: application/json" \
  -d '{"nome":"João Silva Atualizado","ativo":false}'
```

### Alternar Status de Utilizador
```bash
curl -X PATCH http://localhost:3000/users/1
```

### Remover Utilizador
```bash
curl -X DELETE http://localhost:3000/users/1
```

### Obter Estatísticas de Utilizadores
```bash
curl http://localhost:3000/users/stats
```

### Listar Tarefas
```bash
curl http://localhost:3000/tasks
```

### Criar Nova Tarefa
```bash
curl -X POST http://localhost:3000/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "titulo":"Estudar Node.js",
    "categoria":"trabalho",
    "responsavelNome":"Daniel Moraes"
  }'
```

### Atualizar Tarefa e Marcar como Concluída
```bash
curl -X PUT http://localhost:3000/tasks/1 \
  -H "Content-Type: application/json" \
  -d '{
    "titulo":"Tarefa Atualizada",
    "categoria":"trabalho",
    "concluida":true,
    "responsavelNome":"Daniel Moraes"
  }'
```

### Remover Tarefa
```bash
curl -X DELETE http://localhost:3000/tasks/1
```

### Buscar Tarefas
```bash
curl http://localhost:3000/tasks?search=Express
```

### Ordenar Tarefas
```bash
curl http://localhost:3000/tasks?sort=desc
```

### Obter Estatísticas de Tarefas
```bash
curl http://localhost:3000/tasks/stats
```

## 📁 Estrutura de Ficheiros

```
PROJETOM3/
├── server.js                 # Arquivo principal com todas as rotas
├── controllers/
│   ├── userController.js     # Lógica de resposta HTTP para utilizadores
│   └── taskController.js     # Lógica de resposta HTTP para tarefas
├── services/
│   ├── userService.js        # Lógica de negócio para utilizadores
│   └── taskService.js        # Lógica de negócio para tarefas
├── middlewares/
│   └── checkUserExists.js    # Middleware de verificação de utilizador
├── DOCUMENTACAO.md           # Documentação completa
├── RESUMO.md                 # Resumo técnico
├── API_README.md             # Este arquivo
└── package.json              # Dependências
```

## ✅ Validações Implementadas

### Utilizadores
- ✅ Email deve ser válido (formato)
- ✅ Email deve ser único (sem duplicatas)
- ✅ Nome obrigatório
- ✅ Status ativo padrão em `true`

### Tarefas
- ✅ Título com mais de 3 caracteres
- ✅ Responsável obrigatório
- ✅ Categoria obrigatória
- ✅ Concluída padrão em `false`
- ✅ `dataConclusao` automática quando concluida=true

## 🔄 Fluxo de Requisição

```
Cliente
   ↓
Express Router
   ↓
Middleware (checkUserExists se aplicável)
   ↓
Controller (userController/taskController)
   ↓
Service (userService/taskService)
   ↓
Modificação de Array/Dados
   ↓
Controller retorna JSON
   ↓
Cliente
```

## 📊 Dados de Exemplo

### Utilizadores Iniciais
```javascript
{
  "id": 1,
  "nome": "João Silva",
  "email": "joao@example.com",
  "ativo": true
},
{
  "id": 2,
  "nome": "Maria Santos",
  "email": "maria@example.com",
  "ativo": true
}
```

### Tarefas Iniciais
```javascript
{
  "id": 1,
  "titulo": "Criar login",
  "categoria": "trabalho",
  "concluida": false,
  "responsavelNome": "João Silva",
  "dataConclusao": null
},
{
  "id": 2,
  "titulo": "Criar dashboard",
  "categoria": "trabalho",
  "concluida": false,
  "responsavelNome": "Maria Santos",
  "dataConclusao": null
}
```

## 🎓 Conceitos Implementados

- ✅ RESTful API design
- ✅ Express.js routing
- ✅ Middleware em Express
- ✅ Validação de dados
- ✅ Operações CRUD completas
- ✅ HTTP status codes apropriados
- ✅ Query parameters (sort, search)
- ✅ Separação de responsabilidades (MVC)
- ✅ Manipulação de arrays em memória
- ✅ Lógica automática (dataConclusao, ID auto-increment)

## 💾 Armazenamento de Dados

- Dados são armazenados em **memória** (arrays JavaScript)
- Não persistem após reinicializar o servidor
- Para produção, seria necessário adicionar banco de dados (MongoDB, PostgreSQL, etc.)

## 🚀 Próximas Melhorias

1. Adicionar banco de dados (MongoDB/PostgreSQL)
2. Implementar autenticação JWT
3. Criar testes unitários com Jest
4. Adicionar logging com Winston
5. Documentação com Swagger/OpenAPI
6. Implementar paginação
7. Adicionar rate limiting
8. Melhorar tratamento de erros global

## 🔐 HTTP Status Codes Utilizados

- **200 OK**: Sucesso em GET/PUT
- **201 Created**: Sucesso em POST
- **204 No Content**: Sucesso em DELETE
- **400 Bad Request**: Erro de validação
- **404 Not Found**: Recurso não encontrado

---

**Desenvolvido como exercício de aprendizado de Node.js e Express** 🎉
