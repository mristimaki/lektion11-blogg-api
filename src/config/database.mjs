import { Pool } from "pg";

// Skapar en connection pool till PostgreSQL-databas
// En pool låter oss återanvända databasanslutningar istället för att öppna en ny varje gång
// Det är mycket mer effektivt
export const pool = new Pool({
    host: process.env.DATABASE_HOST, // Var databasen finns (t.ex. localhost)
    database: process.env.DATABASE_NAME, // Namnet på vår databas
    user: process.env.DATABASE_USER, // Användarnamn för att logga in
    password: process.env.DATABASE_PASSWORD, // Lösenord för att logga in
    port: Number.parseInt(process.env.DATABASE_PORT), // Vilken port databasen lyssnar på (vanligtvis 5432)
});

// Denna funktion körs när appen startar och skapar våra databastabeller
export async function setupDatabase() {
    // Ansluter till databasen
    await pool.connect();

    // Skapar posts-tabellen om den inte redan finns (IF NOT EXISTS)
    // SERIAL PRIMARY KEY = id ökar automatiskt för varje ny post
    // NOT NULL = fältet måste ha ett värde
    // DEFAULT = sätter ett standardvärde om inget anges
    await pool.query(`CREATE TABLE IF NOT EXISTS posts (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        content TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        author TEXT NOT NULL,
        likes INT NOT NULL DEFAULT 0)`);

    console.log("Database is ready!");
}