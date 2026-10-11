USE todo_app;

ALTER TABLE users
  ADD COLUMN username VARCHAR(50) NULL AFTER id,
  ADD COLUMN fullname VARCHAR(100) NULL AFTER username;

-- Gán username tạm, duy nhất cho các tài khoản đã tồn tại.
UPDATE users
SET username = CONCAT('user_', id)
WHERE username IS NULL OR TRIM(username) = '';

ALTER TABLE users
  MODIFY COLUMN username VARCHAR(50) NOT NULL;

CREATE UNIQUE INDEX uq_users_username
  ON users (username);
