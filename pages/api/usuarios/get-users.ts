import { NextApiHandler } from "next";
import { query } from "../../../lib/db";
import { verify } from "jsonwebtoken";
import NextCors from "nextjs-cors";

const handler: NextApiHandler = async (req, res) => {
  await NextCors(req, res, {
    // Options
    methods: ["GET"],
    origin: "http://localhost:3001",
    optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
  });
  const KEY = "asdasdasfdfasdasfdsgsfdgsfgsfgsfg56sf5sdf";
  try {
    const auth = req.headers.authorization.replace("Bearer ", "");

    return verify(auth!, KEY, async function (err, decoded) {
      if (!err && decoded) {
        const results = await query(`
        SELECT * FROM users
        ORDER BY id DESC
        LIMIT 10
    `);

        if (results[0].role_id != null) {
          const roleRes = await query(
            `
  SELECT *
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
        return res.json(results);
      } else {
        return res.json("Sorry you are not authenticated");
      }
    });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

export default handler;

// export const authenticated = (fn: NextApiHandler) => async (
//   req: NextApiRequest,
//   res: NextApiResponse
// ) => {
//   const auth = req.headers.authorization.replace("Bearer ", "");
//   verify(auth!, KEY, async function (err, decoded) {
//     if (!err && decoded) {
//       return await fn(req, res);
//     }
//     return res.json("Sorry you are not authenticated");
//   });
// };
