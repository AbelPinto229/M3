-- ============================================
-- ClickUp Clone - Database Schema
-- ============================================

CREATE DATABASE IF NOT EXISTS clickup;
USE clickup;

-- ============================================
-- Tabela: users
-- ============================================
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  status ENUM('ativo', 'inativo') DEFAULT 'ativo',
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Tabela: tasks
-- ============================================
CREATE TABLE IF NOT EXISTS tasks (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  status ENUM('pendente', 'em_progresso', 'concluida', 'cancelada') DEFAULT 'pendente',
  priority ENUM('baixa', 'media', 'alta', 'urgente') DEFAULT 'media',
  assignedUserId INT,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (assignedUserId) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_status (status),
  INDEX idx_priority (priority),
  INDEX idx_assignedUser (assignedUserId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Tabela: tags
-- ============================================
CREATE TABLE IF NOT EXISTS tags (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50) NOT NULL UNIQUE,
  color VARCHAR(7) DEFAULT '#3498db',
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Tabela: comments
-- ============================================
CREATE TABLE IF NOT EXISTS comments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  taskId INT NOT NULL,
  userId INT NOT NULL,
  conteudo TEXT NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (taskId) REFERENCES tasks(id) ON DELETE CASCADE,
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_task (taskId),
  INDEX idx_user (userId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Tabela: task_tags (Many-to-Many)
-- ============================================
CREATE TABLE IF NOT EXISTS task_tags (
  taskId INT NOT NULL,
  tagId INT NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (taskId, tagId),
  FOREIGN KEY (taskId) REFERENCES tasks(id) ON DELETE CASCADE,
  FOREIGN KEY (tagId) REFERENCES tags(id) ON DELETE CASCADE,
  INDEX idx_task (taskId),
  INDEX idx_tag (tagId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Dados de exemplo (opcional)
-- ============================================

-- Inserir usuários de exemplo
INSERT INTO users (name, email, status) VALUES
('João Silva', 'joao@example.com', 'ativo'),
('Maria Santos', 'maria@example.com', 'ativo'),
('Pedro Costa', 'pedro@example.com', 'inativo');

-- Inserir tags de exemplo
INSERT INTO tags (name, color) VALUES
('Bug', '#e74c3c'),
('Feature', '#2ecc71'),
('Urgente', '#e67e22'),
('Documentação', '#3498db');

-- Inserir tarefas de exemplo
INSERT INTO tasks (title, description, status, priority, assignedUserId) VALUES
('Corrigir bug no login', 'Usuários não conseguem fazer login', 'em_progresso', 'alta', 1),
('Implementar dashboard', 'Criar dashboard com estatísticas', 'pendente', 'media', 2),
('Atualizar documentação', 'Documentar novas funcionalidades', 'concluida', 'baixa', 1);

-- Associar tags às tarefas
INSERT INTO task_tags (taskId, tagId) VALUES
(1, 1), -- Tarefa 1 com tag Bug
(1, 3), -- Tarefa 1 com tag Urgente
(2, 2), -- Tarefa 2 com tag Feature
(3, 4); -- Tarefa 3 com tag Documentação

-- Inserir comentários de exemplo
INSERT INTO comments (taskId, userId, conteudo) VALUES
(1, 2, 'Já identifiquei o problema, estou trabalhando na correção'),
(1, 1, 'Ótimo! Precisa de ajuda?'),
(2, 2, 'Vou começar o desenvolvimento amanhã');
