import express from "express";
import 'dotenv/config';
import friends from "./src/routes/friends.js";
import createDatabase from './src/config/db.js';

createDatabase();
const app = express();
const PORT = 5000;

app.use(express.json());

app.use("/api/friend", friends);

app.listen(PORT, ()=>{
    console.log(`Server started at http://localhost:${PORT}`);
})