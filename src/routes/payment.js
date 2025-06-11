import express from "express";
import {getConnection, sql} from '../config/db.js';

const router = express.Router();

const pool = await getConnection();

router.get("/", async (req, res)=>{
    try {
    const result = await pool.request().query('SELECT * FROM Friends');
    res.json(result.recordset);
    
  } catch (error) {
    console.error('Error fetching friends:', error);
    res.status(500).json({ error: 'Failed to fetch friends' });
  }
});

export default router;