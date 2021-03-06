import { NextApiHandler } from "next";
import { query } from "../../../lib/db";

const handler: NextApiHandler = async (req, res) => {
  const { id } = req.query;
  try {
    if (!id) {
      return res.status(400).json({ message: "`id` required" });
    }
    if (typeof parseInt(id.toString()) !== "number") {
      return res.status(400).json({ message: "`id` must be a number" });
    }
    const results = await query(
      `
      SELECT * FROM mascotas
      WHERE id = ?
    `,
      id
    );

    if (results[0].users_id != null) {
      const usrRes = await query(
        `
    SELECT *
    FROM users
    WHERE id = ?
  `,
        results[0].users_id
      );

      results[0].users_id = usrRes;
    }

    if (results[0].image_id != null) {
      const imgRes = await query(
        `
  SELECT *
  FROM image
  WHERE id = ?
`,
        results[0].image_id
      );

      results[0].image_id = imgRes;
    }

    if (results[0].qr_devices_id != null) {
      const qrRes = await query(
        `
  SELECT *
  FROM qr_devices
  WHERE id = ?
`,
        results[0].qr_devices_id
      );

      results[0].qr_devices_id = qrRes;
    }

    return res.json(results[0]);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

export default handler;
