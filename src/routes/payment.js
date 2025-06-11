import express from "express";
import {getConnection, sql} from '../config/db.js';

const router = express.Router();

router.get("/", async (req, res)=>{
  try {
    const pool = await getConnection();
    const result = await pool.request().query('SELECT F.name, P.amount, P.date, P.notes, P.payment_id FROM Payments P JOIN Friends F ON P.friend_id = F.id');
    res.json(result.recordset);

  } catch (error) {
    console.error('Error fetching friends:', error);
    res.status(500).json({ error: 'Failed to fetch data' });
  }
});

router.post("/", async (req, res)=>{
  const { friend_id, amount, notes, payment_id } = req.body;

  if (!friend_id || !amount || !payment_id) {
    return res.status(400).json({ error: "friend_id and amount and payment_id are required" });
  }

  const currentDate = new Date(); 

  try {
    const pool = await getConnection();

    await pool.request()
      .input("friend_id", sql.Int, friend_id)
      .input("amount", sql.Decimal(10, 2), amount)
      .input("date", sql.DateTime, currentDate) 
      .input("notes", sql.VarChar(255), notes || null)
      .input("payment_id", sql.VarChar(50), payment_id )
      .query(`
        INSERT INTO Payments (friend_id, amount, date, notes, payment_id)
        VALUES (@friend_id, @amount, @date, @notes, @payment_id)
      `);

    res.status(201).json({ message: "Payment added successfully" });
  } catch (error) {
    console.error("Error inserting payment:", error);
    res.status(500).json({ error: "Failed to add payment" });
  }
})

export default router;