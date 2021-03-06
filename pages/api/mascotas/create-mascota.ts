import { NextApiHandler } from "next";
import filter from "bad-words";
import { query } from "../../../lib/db";
import NextCors from "nextjs-cors";

const handler: NextApiHandler = async (req, res) => {
  await NextCors(req, res, {
    // Options
    methods: ["POST"],
    origin: "http://localhost:3001",
    optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
  });
  const {
    nombre,
    tipo,
    raza,
    direccion,
    descripcion,
    contacto,
    users_id,
    image_id,
  } = req.body;
  try {
    if (!nombre || !tipo) {
      return res
        .status(400)
        .json({ message: "`nombre`, `tipo` and `raza` are  required" });
    }

    const results = await query(
      `INSERT INTO mascotas (nombre, tipo, raza, direccion, descripcion, contacto, users_id, image_id)  VALUES (?, ?, ?, ?, ?, ?, ?, ?) `,
      [nombre, tipo, raza, direccion, descripcion, contacto, users_id, image_id]
    );

    return res.json(results);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

export default handler;
