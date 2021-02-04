import { NextApiHandler } from 'next'
import Filter from 'bad-words'
import { query } from '../../../lib/db'

const filter = new Filter()

const handler: NextApiHandler = async (req, res) => {
  const { id,
    username,
    email,
    password,
    phone,
    address,
    fullName,
    role_id,
    image_id,
  } = req.body
  try {
    if (!id || !username || !email || !password) {
      return res
        .status(400)
        .json({ message: "`username`, `password` and `email` are  required" });
    }

    const results = await query(
      `
      UPDATE entries
      SET username = ?, email = ?, password = ?, phone = ?, address = ?, fullName = ?, role_id = ?, image_id = ?
      WHERE id = ?
      `,
      [
        filter.clean(username),
        filter.clean(email),
        filter.clean(password),
        phone,
        address,
        fullName,
        role_id,
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
