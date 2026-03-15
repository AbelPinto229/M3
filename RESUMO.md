# Resumo da Implementação - API ClickUP

## ✅ Todos os 13 Exercícios Implementados

A API foi construída com uma arquitetura baseada em **Controllers, Services, e Middlewares**.

## 📁 Estrutura de Ficheiros Criados

```
PROJETOM3/
├── server.js                          # Arquivo principal com todas as rotas
│
├── controllers/
│   ├── userController.js              # Lógica de resposta HTTP para utilizadores
│   └── taskController.js              # Lógica de resposta HTTP para tarefas
│
├── services/
│   ├── userService.js                 # Lógica de negócio para utilizadores
│   └── taskService.js                 # Lógica de negócio para tarefas
│
├── middlewares/
│   └── checkUserExists.js             # Middleware de verificação de utilizador
│
├── DOCUMENTACAO.md                    # Documentação completa dos endpoints
├── testes.sh                          # Script de exemplos de testes
└── package.json                       # Dependências do projeto
```

## 🎯 Exercícios Implementados

### Utilizadores
1. ✅ **GET /users** - Listar todos os utilizadores
2. ✅ **POST /users** - Criar novo utilizador (com validação de email)
3. ✅ **PUT /users/:id** - Atualizar utilizador
4. ✅ **PATCH /users/:id** - Alternar status ativo/inativo
5. ✅ **DELETE /users/:id** - Remover utilizador

### Tarefas
6. ✅ **GET /tasks** - Listar todas as tarefas
7. ✅ **POST /tasks** - Criar nova tarefa (com validações)
8. ✅ **PUT /tasks/:id** - Atualizar tarefa (com dataConclusao automática)
9. ✅ **DELETE /tasks/:id** - Remover tarefa

### Funcionalidades Avançadas
10. ✅ **Ordenação** - GET /users?sort=asc|desc e GET /tasks?sort=asc|desc
11. ✅ **Pesquisa** - GET /users?search=nome e GET /tasks?search=titulo
12. ✅ **Estatísticas** - GET /users/stats e GET /tasks/stats
13. ✅ **Middleware** - checkUserExists para validar utilizador

## 🔍 Validações Implementadas

### Utilizadores
- ✅ Email válido (formato correto)
- ✅ Email único (não duplicar)
- ✅ Nome obrigatório
- ✅ Email obrigatório
- ✅ Status ativo padrão em true

### Tarefas
- ✅ Título com mais de 3 caracteres
- ✅ Responsável não vazio
- ✅ Categoria obrigatória
- ✅ Concluída padrão em false
- ✅ dataConclusao automática quando concluida=true

## 🚀 Como Usar

### Iniciar o servidor
```bash
node server.js
```

O servidor rodará em: `http://localhost:3000`

### Testar um endpoint
```bash
# Listar utilizadores
curl http://localhost:3000/users

# Criar utilizador
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{"nome":"teste","email":"teste@example.com"}'

# Listar tarefas com ordenação
curl http://localhost:3000/tasks?sort=desc

# Pesquisar tarefas
curl http://localhost:3000/tasks?search=Express
```

## 📊 Dados de Exemplo

### Utilizadores Iniciais
```javascript
{
  "id": 1,
  "nome": "João Silva",
  "email": "joao@example.com",
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
}
```

## 💡 Arquitetura

### Service Layer (services/)
Responsável pela lógica de negócio:
- Gerenciar dados (arrays de objetos)
- Validações
- Operações CRUD
- Filtros e ordenações

### Controller Layer (controllers/)
Responsável pela resposta HTTP:
- Receber requisições
- Chamar services
- Retornar respostas JSON com status corretos

### Middleware Layer (middlewares/)
Responsável por verificações:
- Validar existência de recursos
- Modificar req/res conforme necessário

## 🎓 Conceitos Aprendidos

- ✅ RESTful API design
- ✅ Express.js routing
- ✅ Middleware em Express
- ✅ Validação de dados
- ✅ Operações CRUD
- ✅ HTTP status codes
- ✅ Query parameters (sort, search)
- ✅ Separação de responsabilidades (MVC)

## 📝 Notas Importantes

- Dados são armazenados em memória (não persistem após reinicializar)
- Para persistência, seria necessário adicionar um banco de dados (MongoDB, PostgreSQL, etc.)
- Todas as validações são feitas no service layer
- O middleware checkUserExists é reutilizável para outras rotas

## 🔧 Possíveis Melhorias

1. Adicionar banco de dados (MongoDB/PostgreSQL)
2. Implementar autenticação (JWT)
3. Adicionar logging
4. Criar testes unitários
5. Adicionar documentação Swagger/OpenAPI
6. Implementar paginação
7. Adicionar rate limiting
8. Melhorar tratamento de erros global

---

Todos os 13 exercícios foram implementados com sucesso! 🎉
