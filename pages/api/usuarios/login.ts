import { NextApiHandler } from "next";
import Filter from "bad-words";
import { query } from "../../../lib/db";
import { sign } from "jsonwebtoken";
import { compare } from "bcrypt";
import NextCors from "nextjs-cors";

const KEY = "asdasdasfdfasdasfdsgsfdgsfgsfgsfg56sf5sdf";

const handler: NextApiHandler = async (req, res) => {
  await NextCors(req, res, {
    // Options
    methods: ["POST"],
    origin: "http://10.0.2.2:8081",
    // origin: "http://localhost:3001",
    optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
  });

  console.log(process.env.ORIGIN_URL);

  const { username, password } = req.body;
  try {
    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "`password` and `username` are  required" });
    }

    const results = await query(
      `SELECT id, username, email, password,  phone, address, fullName, role_id, image_id FROM users WHERE username = ?`,
      username
    );

    // if (results.length > 0) {
      if (results) {
      if (results[0].role_id != null) {
        const roleRes = await query(
          `SELECT *
  FROM role
  WHERE id = ?
  `,
          results[0].role_id
        );

        results[0].role_id = roleRes;
      }

      if (results[0].image_id != null) {
        const imgRes = await query(
          `
  SELECT *
  FROM image
  WHERE id = ?
  `,
          results[0].image_id
        );

        results[0].image_id = imgRes;
      }

      const passwordEnteredByUser = password;
      const hash = results[0].password;

      const claims = {
        email: results[0].email,
        username: results[0].username,
        fullName: results[0].fullName,
      };
      const jwt = sign(claims, KEY, { expiresIn: "15m" });

      return await compare(passwordEnteredByUser, hash).then(function (resu) {
        if (resu) {
          return res.json({ jwt, user: results[0] });
        } else return res.json("Password NOT matches!");
      });
    } else return res.json("Password");
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

export default handler;
