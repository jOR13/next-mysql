import { NextApiHandler } from "next";
import Filter from "bad-words";
import { query } from "../../../lib/db";

const filter = new Filter();

const handler: NextApiHandler = async (req, res) => {
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
      [
        filter.clean(nombre),
        filter.clean(tipo),
        filter.clean(raza),
        direccion,
        descripcion,
        contacto,
        users_id,
        image_id,
      ]
    );

    return res.json(results);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

export default handler;
