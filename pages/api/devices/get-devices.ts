import { NextApiHandler } from "next";
import NextCors from "nextjs-cors";
import { query } from "../../../lib/db";

const handler: NextApiHandler = async (req, res) => {
  try {
    await NextCors(req, res, {
      // Options
      methods: ["GET"],
      origin: "http://localhost:3001",
      optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
    });
    const results = await query(`
      SELECT * FROM qr_devices
      ORDER BY id DESC
      LIMIT 10
  `);

    
    return res.json(results);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

export default handler;
