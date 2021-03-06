import { NextApiHandler } from "next";
import Filter from "bad-words";
import { query } from "../../../lib/db";
import NextCors from "nextjs-cors";
const filter = new Filter();
const handler: NextApiHandler = async (req, res) => {
  await NextCors(req, res, {
    // Options
    methods: ["PUT"],
    origin: "http://localhost:3001",
    optionsSuccessStatus: 200,
  });

  let { id, qr_devices_id } = req.body;
  try {
    if (!id) {
      return res
        .status(400)
        .json({ message: "`id`,`title`, and `content` are all required" });
    }

    if (qr_devices_id === null) {

        qr_devices_id = "null";
        
    }

    const results = await query(
      `UPDATE mascotas SET qr_devices_id = ${qr_devices_id} WHERE id = ${id}`
    );

    return res.json(results);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

export default handler;
