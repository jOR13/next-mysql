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
    optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
  });
  const {
    id,
    status,
    latitude,
    longitude,
    lastScan,
    alerta,
    mascotas_id,
    users_id,
  } = req.body;
  try {
    if (!id || !status) {
      return res
        .status(400)
        .json({ message: "`id`, and `status` are all required" });
    }

    const results = await query(
      `
      UPDATE qr_devices
      SET status = ?, latitude = ?, longitude = ?, lastScan = ?, alerta = ?, mascotas_id = ?, users_id = ?  WHERE id = ?
      `,
      [
        status,
        latitude,
        longitude,
        lastScan,
        alerta,
        mascotas_id,
        users_id,
      ]
    ]
    );

    return res.json(results);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

export default handler;
