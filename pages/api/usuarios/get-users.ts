import { NextApiHandler } from "next";
import { query } from "../../../lib/db";

const handler: NextApiHandler = async (_, res) => {
  try {
    const results = await query(`
      SELECT * FROM users
      ORDER BY id DESC
      LIMIT 10
  `);

    if (results[0].image_id != null && results[0].role_id != null) {
      const roleRes = await query(
        `
SELECT *
FROM role
WHERE id = ?
`,
        results[0].role_id
      );

      const imgRes = await query(
        `
SELECT *
FROM image
WHERE id = ?
`,
        results[0].image_id
      );

      results[0].role_id = roleRes;
      results[0].image_id = imgRes;
    }
    return res.json(results);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

export default handler;
