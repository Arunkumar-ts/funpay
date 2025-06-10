import 'dotenv/config';
import sql from "mssql";

const config = {
  user: process.env.DB_USER || "sa",       // Use environment variables
  password: process.env.DB_PASSWORD || "123456",
  server: process.env.DB_SERVER || "localhost",
  database: "master",  // Connect to master DB for creating new database
  options: {
    encrypt: false, 
    trustServerCertificate: true,
    enableArithAbort: true
  }
};

async function createDatabase() {
  let pool;
  try {
    pool = await sql.connect(config);
    
    // Check if database exists first
    const result = await pool.request()
      .query(`SELECT name FROM sys.databases WHERE name = 'paymentgateway'`);
    
    if (result.recordset.length === 0) {
      await pool.request()
        .query(`CREATE DATABASE paymentgateway`);
      console.log("Database created successfully");
    } else {
      console.log("Database already exists");
    }
    
  } catch (err) {
    console.error("Error:", err.message);  // More specific error
  } finally {
    if (pool) {
      await pool.close();
    }
  }
}

export default createDatabase;