import 'dotenv/config';
import sql from "mssql";

const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD ,
  server: process.env.DB_SERVER ,
  database: process.env.DB_NAME,  
  options: {
    trustServerCertificate: true,
    enableArithAbort: true,
    trustedConnection: false,
    // instancename:"SQLEXPRESS"
  },
  // port:1433 
};

let pool;

export const getConnection = async () => {
  try {
    if (!pool) {
      pool = await sql.connect(config);
      console.log('Connected to SQL Server');
    }
      return pool;
  } catch (err) {
    console.error('SQL Server connection error:', err);
    throw err;
  }
};

export { sql };