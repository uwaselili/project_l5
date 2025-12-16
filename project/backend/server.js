const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
const PORT = 5000;



app.use(cors());
app.use(express.json());



const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "", 
    database: "kigali_tech"
});



db.connect((err) => {
    if (err) {
        console.error("Database connection failed:", err);
        return;
    }
    console.log("MySQL Connected Successfully");
});





app.post("/products", (req, res) => {
    const {
        name,
        category,
        quantity,
        unit_price,
        supplier,
        date_added,
        status
    } = req.body;

    const sql = `
        INSERT INTO products
        (name, category, quantity, unit_price, supplier, date_added, status)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(
        sql,
        [name, category, quantity, unit_price, supplier, date_added, status],
        (err, result) => {
            if (err) {
                return res.status(400).json({ error: err.message });
            }
            res.status(201).json({
                message: "Product added successfully",
                product_id: result.insertId
            });
        }
    );
});



app.get("/products", (req, res) => {
    const sql = "SELECT * FROM products";

    db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(200).json(results);
    });
});



app.put("/products/:id", (req, res) => {
    const { id } = req.params;
    const {
        name,
        category,
        quantity,
        unit_price,
        supplier,
        date_added,
        status
    } = req.body;

    const sql = `
        UPDATE products SET
        name = ?,
        category = ?,
        quantity = ?,
        unit_price = ?,
        supplier = ?,
        date_added = ?,
        status = ?
        WHERE product_id = ?
    `;

    db.query(
        sql,
        [name, category, quantity, unit_price, supplier, date_added, status, id],
        (err, result) => {
            if (err) {
                return res.status(400).json({ error: err.message });
            }
            res.status(200).json({ message: "Product updated successfully" });
        }
    );
});


app.delete("/products/:id", (req, res) => {
    const { id } = req.params;

    const sql = "DELETE FROM products WHERE product_id = ?";

    db.query(sql, [id], (err) => {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        res.status(200).json({ message: "Product deleted successfully" });
    });
});



app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
