import express from "express";
import 'dotenv/config';
import friends from "./src/routes/friends.js";
import payments from "./src/routes/payment.js";
import { getConnection } from "./src/config/db.js";

await getConnection();
const app = express();
const PORT = 5000;

app.use(express.json());

app.use("/api/friends", friends);
app.use("/api/payments", payments);

app.listen(PORT, ()=>{
    console.log(`Server started at http://localhost:${PORT}`);
})