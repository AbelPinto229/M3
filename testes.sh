#!/bin/bash

# EXEMPLOS DE TESTES COM CURL
# Execute este arquivo para testar todos os endpoints

BASE_URL="http://localhost:3000"

echo "==============================================="
echo "TESTES - API ClickUP"
echo "==============================================="

# ============ UTILIZADORES ============
echo -e "\n--- EXERCÍCIO 1 & 10: GET /users ---"
curl -s "$BASE_URL/users" | json_pp

echo -e "\n--- EXERCÍCIO 1: GET /users com SORT DESC ---"
curl -s "$BASE_URL/users?sort=desc" | json_pp

echo -e "\n--- EXERCÍCIO 11: GET /users com SEARCH ---"
curl -s "$BASE_URL/users?search=João" | json_pp

echo -e "\n--- EXERCÍCIO 12: GET /users/stats ---"
curl -s "$BASE_URL/users/stats" | json_pp

echo -e "\n--- EXERCÍCIO 2: POST /users (criar) ---"
curl -s -X POST "$BASE_URL/users" \
  -H "Content-Type: application/json" \
  -d '{"nome":"Ana Costa","email":"ana.costa@example.com"}' | json_pp

echo -e "\n--- EXERCÍCIO 3: PUT /users/:id (atualizar) ---"
curl -s -X PUT "$BASE_URL/users/1" \
  -H "Content-Type: application/json" \
  -d '{"nome":"João Silva Atualizado","ativo":false}' | json_pp

echo -e "\n--- EXERCÍCIO 4: PATCH /users/:id (toggle) ---"
curl -s -X PATCH "$BASE_URL/users/1" | json_pp

echo -e "\n--- EXERCÍCIO 13: GET /users/:id (com middleware) ---"
curl -s "$BASE_URL/users/1" | json_pp

echo -e "\n--- EXERCÍCIO 5: DELETE /users/:id ---"
curl -s -X DELETE "$BASE_URL/users/1" -w "\nStatus: %{http_code}\n"

# ============ TAREFAS ============
echo -e "\n--- EXERCÍCIO 6 & 10: GET /tasks ---"
curl -s "$BASE_URL/tasks" | json_pp

echo -e "\n--- EXERCÍCIO 6: GET /tasks com SORT DESC ---"
curl -s "$BASE_URL/tasks?sort=desc" | json_pp

echo -e "\n--- EXERCÍCIO 11: GET /tasks com SEARCH ---"
curl -s "$BASE_URL/tasks?search=Express" | json_pp

echo -e "\n--- EXERCÍCIO 12: GET /tasks/stats ---"
curl -s "$BASE_URL/tasks/stats" | json_pp

echo -e "\n--- EXERCÍCIO 7: POST /tasks (criar) ---"
curl -s -X POST "$BASE_URL/tasks" \
  -H "Content-Type: application/json" \
  -d '{"titulo":"Aprender GraphQL","categoria":"estudo","responsavelNome":"Maria Santos"}' | json_pp

echo -e "\n--- EXERCÍCIO 8: PUT /tasks/:id (atualizar) ---"
curl -s -X PUT "$BASE_URL/tasks/1" \
  -H "Content-Type: application/json" \
  -d '{"titulo":"Estudar Express.js","concluida":true}' | json_pp

echo -e "\n--- EXERCÍCIO 9: DELETE /tasks/:id ---"
curl -s -X DELETE "$BASE_URL/tasks/2" -w "\nStatus: %{http_code}\n"

echo -e "\n==============================================="
echo "TESTES CONCLUÍDOS"
echo "==============================================="
