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
    nombre,
    tipo,
    raza,
    direccion,
    descripcion,
    contacto,
    users_id,
    image_id,
    qr_devices_id,
  } = req.body;
  try {
    if (!id) {
      return res
        .status(400)
        .json({ message: "`id`,`title`, and `content` are all required" });
    }

    const results = await query(
      `
      UPDATE mascotas
      SET nombre = ?, tipo = ?, raza = ?, direccion = ?, descripcion = ?, contacto = ?, users_id = ?, image_id = ?, qr_devices_id = ?,
      WHERE id = ?
      `,
      [
        nombre,
        tipo,
        raza,
        direccion,
        descripcion,
        contacto,
        users_id,
        image_id,
        id,
        qr_devices_id,
      ]
    );

    return res.json(results);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

export default handler;
