const pool = require('../configs/database.config');



module.exports.findUserByEmail = async (email) => {
  const [result] = await pool.execute(
    `select 
      id,
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

module.exports.findUserForLogin = async (
  email
) => {
  const [rows] = await pool.execute(
    `SELECT
       id,
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

module.exports.createUser = async (email, hashedPassword) => {
  // const [result] = await pool.execute(
  //   `insert into users (email, password_hash) values (?, ?)`,
  //   [email, hashedPassword]
  // );

  const [result] = await pool.execute(
    `insert into users (email, password_hash) values (?, ?)`,
    [email, hashedPassword]
  )

  const insertId = result.insertId; // đây là khóa chính của bản ghi user mới được tạo

  const [newUser] = await pool.execute(
    `select 
        id, 
        email, 
        created_at as createdAt
      from users 
      where id = ?`,
      [insertId]
    );
  
    return newUser[0];
};