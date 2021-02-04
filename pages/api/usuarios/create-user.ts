import { NextApiHandler } from "next";
import Filter from "bad-words";
import { query } from "../../../lib/db";

const filter = new Filter();

const handler: NextApiHandler = async (req, res) => {
  const {
    username,
    email,
    password,
    phone,
    address,
    fullName,
    role_id,
    image_id,
  } = req.body;
  try {
    if (!username || !email || !password ) {
      return res
        .status(400)
        .json({ message: "`username`, `password` and `email` are  required" });
    }

    const results = await query(
      `INSERT INTO users (username, email, password, phone, address, fullName, role_id, image_id)  VALUES (?, ?, ?, ?, ?, ?, ?, ?) `,
      [
        filter.clean(username),
        filter.clean(email),
        filter.clean(password),
        phone,
        address,
        fullName,
        role_id,
        image_id,
      ]
    );

    return res.json(results);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

export default handler;
