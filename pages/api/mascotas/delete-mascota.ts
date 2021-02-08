import { NextApiHandler } from "next";
import { query } from "../../../lib/db";

import NextCors from "nextjs-cors";

const handler: NextApiHandler = async (req, res) => {
  await NextCors(req, res, {
    // Options
    methods: ["DELETE"],
    origin: "http://localhost:3001",
    optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
  });

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
      DELETE FROM mascotas
      WHERE id = ?
  `,
      id
    );
    res.json(results);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

export default handler;
