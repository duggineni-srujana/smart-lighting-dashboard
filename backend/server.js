require("dotenv").config();
const express = require("express");
const cors = require("cors");
const pool = require("./db");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ ok: true, message: "Backend is running" });
});

app.get("/api/rooms", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM rooms ORDER BY id");
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database query failed" });
  }
});

app.post("/api/simulate", async (req, res) => {
  try {
    const [rooms] = await pool.query("SELECT id FROM rooms ORDER BY id");

    for (const room of rooms) {
      const brightness = Math.floor(Math.random() * 101); // 0..100
      const motion = Math.random() < 0.35; // 35% chance
      const power_state = motion || brightness > 60 ? "ON" : "OFF";

      await pool.query(
        `INSERT INTO readings (room_id, brightness, motion, power_state)
         VALUES (?, ?, ?, ?)`,
        [room.id, brightness, motion, power_state]
      );
    }

    res.json({ ok: true, message: "Inserted simulated readings for all rooms" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Simulation failed" });
  }
});

app.get("/api/readings", async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT r.name AS room_name, rd.brightness, rd.motion, rd.power_state, rd.created_at
       FROM readings rd
       JOIN rooms r ON r.id = rd.room_id
       ORDER BY rd.created_at DESC
       LIMIT 20`
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch readings" });
  }
});

app.get("/api/readings/latest", async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT r.id AS room_id, r.name AS room_name,
             rd.brightness, rd.motion, rd.power_state, rd.created_at
      FROM rooms r
      LEFT JOIN readings rd
        ON rd.id = (
          SELECT id FROM readings
          WHERE room_id = r.id
          ORDER BY created_at DESC
          LIMIT 1
        )
      ORDER BY r.id;
    `);

    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch latest readings" });
  }
});


app.post("/api/rooms/:id/toggle", async (req, res) => {
  try {
    const roomId = req.params.id;

    const [[last]] = await pool.query(
      `SELECT * FROM readings WHERE room_id = ? ORDER BY created_at DESC LIMIT 1`,
      [roomId]
    );

    const brightness = last ? last.brightness : 50;
    const motion = last ? !!last.motion : false;
    const power_state = last && last.power_state === "ON" ? "OFF" : "ON";

    await pool.query(
      `INSERT INTO readings (room_id, brightness, motion, power_state)
       VALUES (?, ?, ?, ?)`,
      [roomId, brightness, motion, power_state]
    );

    res.json({ ok: true, roomId, power_state });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to toggle power" });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
