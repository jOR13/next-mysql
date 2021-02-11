import { NextApiHandler } from "next";
import Filter from "bad-words";
import { query } from "../../../lib/db";

import { hash } from "bcrypt";
import NextCors from "nextjs-cors";

const filter = new Filter();

const handler: NextApiHandler = async (req, res) => {

  await NextCors(req, res, {
    // Options
    methods: ["POST"],
    origin: "http://localhost:3001",
    optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
  });
  
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
    if (!username || !email || !password) { 
      return res
        .status(400)
        .json({ message: "`username`, `password` and `email` are  required" });
    }

    hash(password, 10, async function (err, hash) {
      const results = await query(
        `INSERT INTO users (username, email, password, phone, address, fullName, role_id, image_id)  VALUES (?, ?, ?, ?, ?, ?, ?, ?) `,
        [
          filter.clean(username),
          filter.clean(email),
          hash,
          phone,
          address,
          fullName,
          role_id,
          image_id,
        ]
      );
      return res.json(results);
    });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

export default handler;
