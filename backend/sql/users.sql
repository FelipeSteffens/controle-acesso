-- Execute no banco configurado em DB_NAME antes de usar o cadastro.
-- Não cria contas prontas e não apaga uma tabela que já exista.
CREATE TABLE IF NOT EXISTS users (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(254) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('admin', 'user') NOT NULL DEFAULT 'user'
);

-- Se a tabela já existir, confira sua estrutura com SHOW CREATE TABLE users.
-- Ela precisa dos campos acima e de uma restrição UNIQUE para email.


CREATE TABLE desi_20251.logs (
  id INT NOT NULL AUTO_INCREMENT,
  usuario INT NULL,
  datahora DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
  acao VARCHAR(45) NULL,
  recurso_afetado VARCHAR(45) NULL,
  id_recurso_afetado VARCHAR(45) NULL,
  valor_antigo VARCHAR(45) NULL,
  valor_novo VARCHAR(45) NULL,
  campos_alterados TEXT NULL,
  ip VARCHAR(45) NULL,
  codigo_http INT NULL,
  status_acao VARCHAR(45) NULL,
  PRIMARY KEY (id));