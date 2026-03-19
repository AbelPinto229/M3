-- =============================================
-- Adicionar highlight às tasks e criar task_dependencies
-- Corre no MySQL Workbench
-- =============================================

USE clickup_db;

-- 1. Adicionar coluna highlight à tabela tasks (1-5, 0 = sem destaque)
ALTER TABLE tasks ADD COLUMN highlight TINYINT NOT NULL DEFAULT 0 AFTER priority;

-- 2. Criar tabela de dependências entre tasks
CREATE TABLE task_dependencies (
  id             INT AUTO_INCREMENT PRIMARY KEY,
  task_id        INT NOT NULL,
  depends_on_id  INT NOT NULL,
  created_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (task_id)       REFERENCES tasks(id) ON DELETE CASCADE,
  FOREIGN KEY (depends_on_id) REFERENCES tasks(id) ON DELETE CASCADE,
  UNIQUE KEY unique_dependency (task_id, depends_on_id)
);
