import { NextApiHandler } from "next";
import Filter from "bad-words";
import { query } from "../../../lib/db";

const filter = new Filter();

const handler: NextApiHandler = async (req, res) => {
  const {
    status, latitude, longitude, lastScan, alerta, mascotas_id, users_id
  } = req.body;
  try {
    if (!status ) {
      return res
        .status(400)
        .json({ message: "`status`, is  required" });
    }

    const results = await query(
      `INSERT INTO qr_devices (status, latitude, longitude, lastScan, alerta, mascotas_id, users_id)  VALUES (?, ?, ?, ?, ?, ?, ?) `,
      [
        filter.clean(status),
        filter.clean(latitude),
        filter.clean(longitude),
        lastScan,
        alerta,
        mascotas_id,
        users_id
      ]
    );

    return res.json(results);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

export default handler;
