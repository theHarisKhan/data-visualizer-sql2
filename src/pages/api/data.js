import mysql from "mysql2/promise";

export default async function handler(req, res) {
  const { host, user, password, database, sqlquery } = req.body;

  try {
    const db = mysql.createPool({
      host: host,
      user: user,
      password: password,
      database: database,
      port: 3306,
    });

    const rows = await db.query(sqlquery);
    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({ error: error });
  }
}
