import { NextApiHandler } from 'next'
import NextCors from 'nextjs-cors';
import { query } from '../../../lib/db'

const handler: NextApiHandler = async (req, res) => {
  await NextCors(req, res, {
    // Options
    methods: ["GET"],
    // origin: "http://localhost:3001",
    origin: "http://10.0.2.2:8081",
    optionsSuccessStatus: 200,
  });
  const { id } = req.query
  try {
    if (!id) {
      return res.status(400).json({ message: '`id` required' })
    }
    if (typeof parseInt(id.toString()) !== 'number') {
      return res.status(400).json({ message: '`id` must be a number' })
    }
    const results = await query(
      `
      SELECT * FROM qr_devices
      WHERE id = ?
    `,
      id
    )

    if (results) {
      return res.json([]);
    } else {
      if (results[0].users_id != null) {
        const usrRes = await query(
          `SELECT * FROM users WHERE id = ?`,
          results[0].users_id
        );
        results[0].users_id = usrRes;
      }
  
      if (results[0].mascotas_id != null) {
        const masRes = await query(
          `SELECT * FROM mascotas WHERE id = ?`,
          results[0].mascotas_id
        );
  
        results[0].mascotas_id = masRes;
      }
  
    
    }
  
  
      
      return res.json(results);
    } catch (e) {
      res.status(500).json({ message: e.message });
    }
  };
  
  export default handler;
  