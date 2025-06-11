import express from "express";
import {getConnection, sql} from '../config/db.js';

const router = express.Router();

router.get("/", async (req, res)=>{
    try {
        const pool = await getConnection();
        const result = await pool.request().query('SELECT * FROM Friends');
        res.status(200).json(result.recordset);
    } catch (error) {
        console.error('Error fetching friends:', error);
        res.status(500).json({ error: 'Failed to fetch data' });
    }
});

router.post("/", async (req, res)=>{
    const {name , email } = req.body;
     if (!name || !email) {
        return res.status(400).json({ error: "Name and email are required" });
    }
    try {
        const pool = await getConnection();
        await pool.request()
        .input("name", sql.VarChar, name)
        .input("email", sql.VarChar, email)
        .query("INSERT INTO Friends (Name, Email) VALUES (@name, @email)");

        res.status(201).json({ message: "Friend added successfully" });

    } catch (error) {
        if (error.number === 2627) {
        // Unique constraint violation
        return res.status(409).json({ error: "Email already exists" });
        }
        console.error("Error adding friend:", error);
        res.status(500).json({ error: "Failed to add friend" });
    }    
});

router.put("/:id", async (req, res)=>{
    const { id } = req.params;
    const { name, email } = req.body;
    if (!name || !email) {
        return res.status(400).json({ error: "Name and email are required" });
    }
    try {
        const pool = await getConnection();
        const result = await pool.request()
        .input("id", sql.Int, id)
        .input("name", sql.NVarChar, name)
        .input("email", sql.NVarChar, email)
        .query("UPDATE Friends SET Name = @name, Email = @email WHERE Id = @id");

        if (result.rowsAffected[0] === 0) {
        return res.status(404).json({ error: "Friend not found" });
        }

        res.json({ message: "Friend updated successfully" });
    } catch (error) {
        if (error.number === 2627) {
        return res.status(409).json({ error: "Email already in use" });
        }
        console.error("Error updating friend:", error);
        res.status(500).json({ error: "Failed to update friend" });
    }
});

router.delete("/:id", async (req, res)=>{
    const { id } = req.params;
    try {
        const pool = await getConnection();
        const result = await pool.request()
        .input("id", sql.Int, id)
        .query("DELETE FROM Friends WHERE Id = @id");

        if (result.rowsAffected[0] === 0) {
        return res.status(404).json({ error: "Friend not found" });
        }

        res.json({ message: "Friend deleted successfully" });
    } catch (error) {
        console.error("Error deleting friend:", error);
        res.status(500).json({ error: "Failed to delete friend" });
    }
});

export default router;