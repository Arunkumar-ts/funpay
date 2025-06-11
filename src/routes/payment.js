import express from "express";
import { getConnection, sql } from "../config/db.js";

const router = express.Router();

// GET person-wise, this month, this year
router.get("/", async (req, res) => {
  try {
    const pool = await getConnection();

    const thisMonthQuery = `
      SELECT * FROM Payments 
      WHERE MONTH(date) = MONTH(GETDATE()) AND YEAR(date) = YEAR(GETDATE()) 
      ORDER BY date DESC
    `;
    const thisMonthResult = await pool.request().query(thisMonthQuery);

    const thisYearQuery = `
      SELECT * FROM Payments 
      WHERE YEAR(date) = YEAR(GETDATE()) 
      ORDER BY date DESC
    `;
    const thisYearResult = await pool.request().query(thisYearQuery);

    const personWiseQuery = `
      SELECT 
        f.id AS friend_id,
        f.name AS friend_name,
        SUM(p.amount) AS total_amount
      FROM Payments p
      JOIN Friends f ON p.friend_id = f.id
      GROUP BY f.id, f.name
      ORDER BY total_amount DESC
    `;
    const personWiseResult = await pool.request().query(personWiseQuery);

    res.status(200).json({
      personWise: personWiseResult.recordset,
      thisMonth: thisMonthResult.recordset,
      thisYear: thisYearResult.recordset,
    });

  } catch (error) {
    console.error("Error fetching payments report:", error);
    res.status(500).json({ error: "Failed to fetch data" });
  }
});

// GET single friend payment list
router.get("/:friend_id", async (req, res)=>{
  const { friend_id } = req.params;

  if (!friend_id) {
    return res.status(400).json({ error: "friend_id is required" });
  }

  try {
    const pool = await getConnection();
    const result = await pool.request()
      .input("friend_id", sql.Int, friend_id)
      .execute("GetSingleFriendPayDetails");
    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ error: "Friend not found" });
    }

    res.status(200).json(result.recordset);
  } catch (error) {
    console.error("Error fetching friend's payments:", error);
    res.status(500).json({ error: "Failed to fetch friend's payments" });
  }
})

// POST new payment
router.post("/", async (req, res) => {
  const { friend_id, amount, notes, payment_id } = req.body;

  if (!friend_id || !amount || !payment_id) {
    return res.status(400).json({ error: "friend_id, amount, and payment_id are required" });
  }

  const currentDate = new Date();

  try {
    const pool = await getConnection();

    await pool.request()
      .input("friend_id", sql.Int, friend_id)
      .input("amount", sql.Decimal(10, 2), amount)
      .input("date", sql.DateTime, currentDate)
      .input("notes", sql.VarChar(255), notes || null)
      .input("payment_id", sql.VarChar(50), payment_id)
      .query(`
        INSERT INTO Payments (friend_id, amount, date, notes, payment_id)
        VALUES (@friend_id, @amount, @date, @notes, @payment_id)
      `);

    res.status(201).json({ message: "Payment added successfully" });
  } catch (error) {
    console.error("Error inserting payment:", error);
    res.status(500).json({ error: "Failed to add payment" });
  }
});

export default router;
