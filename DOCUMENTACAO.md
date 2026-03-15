# API ClickUP - Documentação Completa

## Estrutura do Projeto

```
project/
├── server.js              # Arquivo principal com todas as rotas
├── controllers/
│   ├── userController.js  # Controlador de utilizadores
│   └── taskController.js  # Controlador de tarefas
├── services/
│   ├── userService.js     # Lógica de utilizadores
│   └── taskService.js     # Lógica de tarefas
├── middlewares/
│   └── checkUserExists.js # Middleware de verificação
└── package.json
```

## Endpoints de Utilizadores

### Exercício 1: Obter Todos os Utilizadores
**GET** `/users`

Retorna todos os utilizadores da aplicação.

**Resposta (200):**
```json
[
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
]
```

---

### Exercício 2: Criar Novo Utilizador
**POST** `/users`

Cria um novo utilizador no sistema.

**Body:**
```json
{
  "nome": "Daniel Moraes",
  "email": "daniel@example.com"
}
```

**Resposta (201):**
```json
{
  "id": 3,
  "nome": "Daniel Moraes",
  "email": "daniel@example.com",
  "ativo": true
}
```

**Validações:**
- Email deve ser válido
- Email deve ser único
- Nome e email são obrigatórios

---

### Exercício 3: Atualizar Utilizador
**PUT** `/users/:id`

Atualiza um utilizador existente.

**Body:**
```json
{
  "nome": "Daniel Moraes Silva",
  "email": "daniel.silva@example.com",
  "ativo": false
}
```

**Resposta (200):**
```json
{
  "id": 1,
  "nome": "Daniel Moraes Silva",
  "email": "daniel.silva@example.com",
  "ativo": false
}
```

---

### Exercício 4: Alternar Ativo/Inativo
**PATCH** `/users/:id`

Alterna o status de ativo/inativo do utilizador.

**Resposta (200):**
```json
{
  "id": 1,
  "nome": "João Silva",
  "email": "joao@example.com",
  "ativo": false
}
```

---

### Exercício 5: Remover Utilizador
**DELETE** `/users/:id`

Remove um utilizador da aplicação.

**Resposta:** 204 (No Content)

---

### Exercício 12: Obter Estatísticas de Utilizadores
**GET** `/users/stats`

Retorna estatísticas sobre os utilizadores.

**Resposta (200):**
```json
{
  "total": 4,
  "ativos": 3,
  "percentagem": 75
}
```

---

### Exercício 10: Ordenar Utilizadores
**GET** `/users?sort=asc|desc`

Ordena os utilizadores pelo nome.

**Exemplos:**
- `GET /users?sort=asc` - Ordem crescente
- `GET /users?sort=desc` - Ordem decrescente

---

### Exercício 11: Pesquisar Utilizadores
**GET** `/users?search=nome`

Pesquisa utilizadores pelo nome ou email.

**Exemplo:** `GET /users?search=João`

**Resposta (200):**
```json
[
  {
    "id": 1,
    "nome": "João Silva",
    "email": "joao@example.com",
    "ativo": true
  }
]
```

---

### Exercício 13: Verificar Utilizador (com Middleware)
**GET** `/users/:id`

Obtém um utilizador específico. Usa o middleware `checkUserExists` para verificar se existe.

**Resposta (200):**
```json
{
  "id": 1,
  "nome": "João Silva",
  "email": "joao@example.com",
  "ativo": true
}
```

**Resposta (404):**
```json
{
  "error": "Utilizador não encontrado"
}
```

---

## Endpoints de Tarefas

### Exercício 6: Obter Todas as Tarefas
**GET** `/tasks`

Retorna todas as tarefas da aplicação.

**Resposta (200):**
```json
[
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
]
```

---

### Exercício 7: Criar Nova Tarefa
**POST** `/tasks`

Cria uma nova tarefa no sistema.

**Body:**
```json
{
  "titulo": "Estudar Node.js",
  "categoria": "trabalho",
  "responsavelNome": "Daniel Moraes"
}
```

**Resposta (201):**
```json
{
  "id": 3,
  "titulo": "Estudar Node.js",
  "categoria": "trabalho",
  "concluida": false,
  "responsavelNome": "Daniel Moraes",
  "dataConclusao": null
}
```

**Validações:**
- Título deve ter mais de 3 caracteres
- Responsável não pode estar vazio
- Todos os campos são obrigatórios

---

### Exercício 8: Atualizar Tarefa
**PUT** `/tasks/:id`

Atualiza uma tarefa existente.

**Body:**
```json
{
  "titulo": "Estudar Express",
  "categoria": "trabalho",
  "responsavelNome": "Daniel Moraes",
  "concluida": true
}
```

**Resposta (200):**
```json
{
  "id": 1,
  "titulo": "Estudar Express",
  "categoria": "trabalho",
  "concluida": true,
  "responsavelNome": "Daniel Moraes",
  "dataConclusao": "2026-03-15"
}
```

**Nota:** Quando `concluida` é definida como `true`, `dataConclusao` é automaticamente preenchida com a data atual. Quando definida como `false`, é definida como `null`.

---

### Exercício 9: Remover Tarefa
**DELETE** `/tasks/:id`

Remove uma tarefa da aplicação.

**Resposta:** 204 (No Content)

---

### Exercício 12: Obter Estatísticas de Tarefas
**GET** `/tasks/stats`

Retorna estatísticas sobre as tarefas.

**Resposta (200):**
```json
{
  "total": 3,
  "pendentes": 1,
  "concluidas": 2
}
```

---

### Exercício 10: Ordenar Tarefas
**GET** `/tasks?sort=asc|desc`

Ordena as tarefas pelo título.

**Exemplos:**
- `GET /tasks?sort=asc` - Ordem crescente
- `GET /tasks?sort=desc` - Ordem decrescente

---

### Exercício 11: Pesquisar Tarefas
**GET** `/tasks?search=titulo`

Pesquisa tarefas pelo título.

**Exemplo:** `GET /tasks?search=Express`

**Resposta (200):**
```json
[
  {
    "id": 1,
    "titulo": "Estudar Express",
    "categoria": "trabalho",
    "concluida": true,
    "responsavelNome": "Daniel Moraes",
    "dataConclusao": "2026-03-15"
  }
]
```

---

## Middleware: checkUserExists

Localizado em `middlewares/checkUserExists.js`

```javascript
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

**Funcionamento:**
1. Extrai o ID do parâmetro da URL
2. Procura o utilizador no serviço
3. Se não encontrar, retorna erro 404
4. Se encontrar, armazena o utilizador em `req.user` e passa para o próximo middleware

---

## Como Executar

```bash
node server.js
```

O servidor iniciará em `http://localhost:3000`

---

## Resumo dos 13 Exercícios

| Exercício | Descrição | Status |
|-----------|-----------|--------|
| 1 | Criar lista de utilizadores | ✅ |
| 2 | Criar novo utilizador | ✅ |
| 3 | Atualizar utilizador | ✅ |
| 4 | Alternar ativo/inativo | ✅ |
| 5 | Remover utilizador | ✅ |
| 6 | Criar lista de tarefas | ✅ |
| 7 | Criar nova tarefa | ✅ |
| 8 | Atualizar tarefa | ✅ |
| 9 | Remover tarefa | ✅ |
| 10 | Ordenar listas (users/tasks) | ✅ |
| 11 | Pesquisa por nome/título | ✅ |
| 12 | Estatísticas (users/tasks) | ✅ |
| 13 | Middleware checkUserExists | ✅ |
