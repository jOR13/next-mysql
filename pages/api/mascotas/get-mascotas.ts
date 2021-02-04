import { NextApiHandler } from "next";
import { query } from "../../../lib/db";

const handler: NextApiHandler = async (_, res) => {
  try {
    const results = await query(`
      SELECT * FROM mascotas
      ORDER BY id DESC
      LIMIT 10
  `);

    const usrRes = await query(
      `
    SELECT *
    FROM users
    WHERE id = ?
  `,
      results[0].users_id
    );

    const imgRes = await query(
      `
    SELECT *
    FROM image
    WHERE id = ?
  `,
      results[0].image_id
    );

    results[0].users_id = usrRes;
    results[0].image_id = imgRes;

    return res.json(results);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

export default handler;
