import express from "express";
import multer from "multer";
import fs from "fs/promises";
import { getFields, convertToJSON } from "./utils.js";
import pool from "./dbconnection.js";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const upload = multer({ dest: "uploads/" });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// serve HTML page
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.post("/upload", upload.single("datafile"), async (req, res) => {
    const client = await pool.connect();
    try {
        console.log("Connected to PostgreSQL");

        await client.query("BEGIN");

        // read the CSV file
        const data = await fs.readFile(req.file.path, "utf8");
        const rows = data.trim().split("\n");
        const headers = rows[0].split(",").map(h => h.trim());

        const template = getFields(headers);

        // create the table
        const createTableQuery = `
            CREATE TABLE IF NOT EXISTS public.users (
                id SERIAL4 NOT NULL,
                name VARCHAR NOT NULL,
                age INT NOT NULL,
                address JSONB,
                additional_info JSONB
            );
            `;
        await client.query(createTableQuery);

        // insert the values
        for (let i = 1; i < rows.length; i++) {
            const values = rows[i].split(",");

            // convert csv to JSON
            const obj = convertToJSON(headers, values, template);

            const name = `${obj.name.firstName} ${obj.name.lastName}`;
            delete obj.name;

            const age = obj.age;
            delete obj.age;

            const address = obj.address;
            delete obj.address;

            const additional_info=obj;
            // const additional_info = { ...obj };
            // delete additional_info.name;
            // delete additional_info.age;
            // delete additional_info.address;
            // console.log(name,age,address,additional_info);
            const insertValueQuery=`INSERT INTO users (name, age, address, additional_info) VALUES ($1, $2, $3, $4)`;
            await client.query(
               insertValueQuery, [name, age, address, additional_info]
            );
        }

        await client.query("COMMIT");

        // Age % Distribution
        const ageDistribution = await client.query(`
            SELECT 
                CASE
                    WHEN age < 20 THEN '<20'
                    WHEN age BETWEEN 20 AND 40 THEN '20-40'
                    WHEN age BETWEEN 41 AND 60 THEN '41-60'
                    ELSE '>60'
                END AS "Age-Group",
                ROUND(100.0 * COUNT(*) / SUM(COUNT(*)) OVER (), 2) AS "% Distribution"
            FROM public.users
            GROUP BY "Age-Group"
            ORDER BY "Age-Group";
            `);
        console.log("Age % distribution Table:", ageDistribution.rows);

        res.status(200).send("CSV processed successfully");

    } catch (err) {
        await client.query("ROLLBACK");
        console.error(err);
        res.status(500).send("Error processing CSV");
    } finally {
        client.release();
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
