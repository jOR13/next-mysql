import { NextApiHandler } from 'next'
import Filter from 'bad-words'
import { query } from '../../../lib/db'

const filter = new Filter()

const handler: NextApiHandler = async (req, res) => {
  const { id, nombre,
    tipo,
    raza,
    direccion,
    descripcion,
    contacto,
    users_id,
    image_id, } = req.body
  try {
    if (!id || !nombre || !tipo) {
      return res
        .status(400)
        .json({ message: '`id`,`title`, and `content` are all required' })
    }

    const results = await query(
      `
      UPDATE mascotas
      SET nombre = ?, tipo = ?, raza = ?, direccion = ?, descripcion = ?, contacto = ?, users_id = ?, image_id = ?
      WHERE id = ?
      `,
      [
        filter.clean(nombre),
        filter.clean(tipo),
        filter.clean(raza),
        direccion,
        descripcion,
        contacto,
        users_id,
        image_id,
        id
      ]
    )

    return res.json(results)
  } catch (e) {
    res.status(500).json({ message: e.message })
  }
}

export default handler
