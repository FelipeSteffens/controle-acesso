-- Execute uma vez no mesmo banco que possui a tabela materials.
-- utf8mb4 mantem acentos e caracteres especiais.
CREATE TABLE IF NOT EXISTS material_comments (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  material_id INT UNSIGNED NOT NULL,
  user_id INT UNSIGNED NOT NULL,
  comment VARCHAR(500) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_material_comments_material (material_id),
  INDEX idx_material_comments_user (user_id)
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
