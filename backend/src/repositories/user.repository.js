const pool = require('../configs/database.config');

module.exports.findUserByEmail = async (email) => {
  const [result] = await pool.execute(
    `select 
      id,
      username,
      fullname,
      email,
      created_at as createdAt
    from users
    where email = ?
    limit 1
    `,
    [email]
  );
  // console.log("result: ", result);
  return result[0] ?? null; // cho dù trả về 1 user thì result vẫn có dạng mảng nên mới cần [0]
};

module.exports.findUserById = async (id) => {
  const [rows] = await pool.execute(
    `SELECT
      id,
      username,
      fullname,
      email,
      created_at AS createdAt
    FROM users
    WHERE id = ?
    LIMIT 1`,
    [id]
  );

  return rows[0] ?? null;
};

module.exports.findUserByUsername = async (username) => {
  const [rows] = await pool.execute(
    `SELECT
      id,
      username,
      fullname,
      email,
      created_at AS createdAt
    FROM users
    WHERE username = ?
    LIMIT 1`,
    [username]
  );

  return rows[0] ?? null;
};

module.exports.findUserForLogin = async (
  email
) => {
  const [rows] = await pool.execute(
    `SELECT
      id,
      username,
      fullname,
      email,
      password_hash AS passwordHash,
      created_at AS createdAt
    FROM users
    WHERE email = ?
    LIMIT 1`,
    [email]
  );

  return rows[0] ?? null;
};

module.exports.createUser = async (
  username,
  fullname,
  email,
  hashedPassword
) => {
  const [result] = await pool.execute(
    `insert into users (
      username,
      fullname,
      email,
      password_hash
    )
    values (?, ?, ?, ?)`,
  [username, fullname, email, hashedPassword]
  );

  const insertId = result.insertId; // đây là khóa chính của bản ghi user mới được tạo

  const [newUser] = await pool.execute(
    `select 
        id, 
        username,
        fullname,
        email, 
        created_at as createdAt
      from users 
      where id = ?`,
      [insertId]
    );
  
    return newUser[0];
};
