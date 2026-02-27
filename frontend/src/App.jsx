import { useEffect, useState } from "react";
import axios from "axios";

const API_BASE = "http://localhost:4000/api";

function App() {
  const [latest, setLatest] = useState([]);
  const [readings, setReadings] = useState([]);
  const [error, setError] = useState("");

  const loadAll = () => {
    setError("");
    Promise.all([
      axios.get(`${API_BASE}/readings/latest`),
      axios.get(`${API_BASE}/readings`),
    ])
      .then(([latestRes, readingsRes]) => {
        setLatest(latestRes.data);
        setReadings(readingsRes.data);
      })
      .catch(() => setError("Failed to fetch data from backend"));
  };

  const simulate = () => {
    setError("");
    axios
      .post(`${API_BASE}/simulate`)
      .then(() => loadAll())
      .catch(() => setError("Failed to simulate readings"));
  };

  const togglePower = (roomId) => {
    setError("");
    axios
      .post(`${API_BASE}/rooms/${roomId}/toggle`)
      .then(() => loadAll())
      .catch(() => setError("Failed to toggle power"));
  };

  useEffect(() => {
    loadAll();
    const timer = setInterval(loadAll, 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1>Smart Lighting Dashboard</h1>

      <button onClick={simulate} style={{ padding: "10px 14px", cursor: "pointer" }}>
        Simulate New Readings
      </button>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <h2 style={{ marginTop: "18px" }}>Latest Status</h2>
      <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
        {latest.map((r) => (
          <div
            key={r.room_id}
            style={{
              border: "1px solid #ddd",
              borderRadius: "12px",
              padding: "12px",
              minWidth: "220px",
            }}
          >
            <div style={{ fontWeight: "bold", marginBottom: "6px" }}>
              {r.room_name}
            </div>
            <div>Power: {r.power_state ?? "—"}</div>
            <div>Motion: {r.motion ? "Yes" : "No"}</div>
            <div>Brightness: {r.brightness ?? "—"}</div>
            <button
             onClick={() => togglePower(r.room_id)}
             style={{ marginTop: "10px", padding: "8px 10px", cursor: "pointer" }}
            >
             Toggle Power
           </button>
    
        <div style={{ marginTop: "8px", fontSize: "12px", opacity: 0.8 }}>
              {r.created_at ? new Date(r.created_at).toLocaleString() : "—"}
            </div>
          </div>
        ))}
      </div>

      <h2 style={{ marginTop: "18px" }}>Recent Readings</h2>
      <div style={{ marginTop: "10px" }}>
        <table border="1" cellPadding="10">
          <thead>
            <tr>
              <th>Room</th>
              <th>Brightness</th>
              <th>Motion</th>
              <th>Power</th>
              <th>Time</th>
            </tr>
          </thead>
          <tbody>
            {readings.map((r, index) => (
              <tr key={index}>
                <td>{r.room_name}</td>
                <td>{r.brightness}</td>
                <td>{r.motion ? "Yes" : "No"}</td>
                <td>{r.power_state}</td>
                <td>{new Date(r.created_at).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;
