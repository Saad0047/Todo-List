import { useState } from "react";

const API_URL = "http://localhost:5000/api";

const COLORS = [
  { hex: "#FFF3B0", name: "Yellow" },
  { hex: "#C7F2D0", name: "Mint" },
  { hex: "#FFD6D6", name: "Pink" },
  { hex: "#FFE4C4", name: "Peach" },
  { hex: "#D6EEFF", name: "Sky" },
  { hex: "#EDD6FF", name: "Lavender" },
];

function darken(hex, amount = 100) {
  const num = parseInt(hex.replace("#", ""), 16);
  const r = Math.max(0, (num >> 16) - amount);
  const g = Math.max(0, ((num >> 8) & 0xff) - amount);
  const b = Math.max(0, (num & 0xff) - amount);
  return `rgb(${r},${g},${b})`;
}

export default function Create({ onAdd, onBack }) {
  const [title,     setTitle]     = useState("");
  const [color,     setColor]     = useState(COLORS[0].hex);
  const [itemInput, setItemInput] = useState("");
  const [items,     setItems]     = useState([]);
  const [error,     setError]     = useState("");
  const [loading,   setLoading]   = useState(false);

  const handleAddItem = () => {
    const trimmed = itemInput.trim();
    if (!trimmed) return;
    setItems((prev) => [...prev, trimmed]);
    setItemInput("");
  };

  const handleRemoveItem = (index) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleCreate = async () => {
    if (!title.trim())      { setError("Please enter a board title."); return; }
    if (items.length === 0) { setError("Add at least one task.");      return; }

    setError("");
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/boards`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: title.trim(), color, items }),
      });
      const savedBoard = await res.json();
      onAdd(savedBoard);
    } catch (err) {
      setError("Could not reach server. Is it running?");
    } finally {
      setLoading(false);
    }
  };

  const preview = {
    title: title || "Board Title",
    color,
    items: items.length ? items : ["Your tasks will appear here..."],
  };

  return (
    <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "48px 28px" }}>
      <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800&family=Playfair+Display:wght@700&display=swap" rel="stylesheet" />

      <button onClick={onBack} style={{
        background: "none", border: "none", cursor: "pointer", color: "#888",
        fontFamily: "'Nunito', sans-serif", fontWeight: "700", fontSize: "14px",
        marginBottom: "28px", padding: 0, display: "flex", alignItems: "center", gap: "6px",
      }}>
        ← Back to Wall
      </button>

      <h1 style={{
        fontFamily: "'Playfair Display', serif", fontSize: "clamp(24px, 3.5vw, 36px)",
        fontWeight: "700", color: "#1a1a1a", margin: "0 0 36px",
      }}>
        Create New Board
      </h1>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "40px", alignItems: "start" }}>

        {/* ── Left: Form ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>

          <div>
            <label style={labelStyle}>Board Title</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Take Class"
              style={inputStyle}
              onFocus={e => e.target.style.borderColor = "#1a1a1a"}
              onBlur={e  => e.target.style.borderColor = "#e0e0e0"}
            />
          </div>

          <div>
            <label style={labelStyle}>Card Color</label>
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              {COLORS.map((c) => (
                <button key={c.hex} title={c.name} onClick={() => setColor(c.hex)} style={{
                  width: "38px", height: "38px", borderRadius: "10px", background: c.hex,
                  border: color === c.hex ? "3px solid #1a1a1a" : "3px solid transparent",
                  cursor: "pointer", boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                  transition: "transform 0.12s",
                  transform: color === c.hex ? "scale(1.15)" : "scale(1)",
                }} />
              ))}
            </div>
          </div>

          <div>
            <label style={labelStyle}>Tasks</label>
            <div style={{ display: "flex", gap: "8px" }}>
              <input
                value={itemInput}
                onChange={(e) => setItemInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddItem()}
                placeholder="Type a task and press Enter"
                style={{ ...inputStyle, flex: 1 }}
                onFocus={e => e.target.style.borderColor = "#1a1a1a"}
                onBlur={e  => e.target.style.borderColor = "#e0e0e0"}
              />
              <button onClick={handleAddItem} style={{
                background: "#1a1a1a", color: "#fff", border: "none", borderRadius: "10px",
                padding: "0 18px", fontFamily: "'Nunito', sans-serif", fontWeight: "700",
                fontSize: "20px", cursor: "pointer",
              }}>+</button>
            </div>

            {items.length > 0 && (
              <ul style={{ listStyle: "none", padding: 0, margin: "12px 0 0" }}>
                {items.map((item, i) => (
                  <li key={i} style={{
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                    padding: "8px 12px", background: "#fff", borderRadius: "8px",
                    marginBottom: "6px", fontSize: "13px", fontWeight: "600", color: "#333",
                    boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
                  }}>
                    <span>{item}</span>
                    <button onClick={() => handleRemoveItem(i)} style={{
                      background: "none", border: "none", cursor: "pointer",
                      color: "#ccc", fontSize: "16px", fontWeight: "700",
                    }}>×</button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {error && (
            <p style={{ color: "#e05050", fontSize: "13px", fontWeight: "700", margin: 0 }}>
              ⚠ {error}
            </p>
          )}

          <div style={{ display: "flex", gap: "12px" }}>
            <button onClick={handleCreate} disabled={loading} style={{
              background: loading ? "#666" : "#1a1a1a", color: "#fff", border: "none",
              borderRadius: "12px", padding: "13px 28px", fontFamily: "'Nunito', sans-serif",
              fontWeight: "800", fontSize: "14px", cursor: loading ? "not-allowed" : "pointer",
              flex: 1, boxShadow: "0 4px 14px rgba(0,0,0,0.18)", transition: "background 0.15s",
            }}>
              {loading ? "Saving…" : "Add to Wall"}
            </button>
            <button onClick={onBack} style={{
              background: "#fff", color: "#555", border: "2px solid #e0e0e0",
              borderRadius: "12px", padding: "13px 22px",
              fontFamily: "'Nunito', sans-serif", fontWeight: "700", fontSize: "14px", cursor: "pointer",
            }}>
              Cancel
            </button>
          </div>
        </div>

        {/* ── Right: Live Preview ── */}
        <div>
          <label style={{ ...labelStyle, marginBottom: "12px", display: "block" }}>Live Preview</label>
          <div style={{
            background: preview.color, borderRadius: "16px", padding: "24px",
            minHeight: "200px", boxShadow: "0 8px 28px rgba(0,0,0,0.10)", transition: "background 0.25s",
          }}>
            <h3 style={{
              margin: "0 0 14px 0", fontSize: "15px", fontWeight: "800",
              fontFamily: "'Nunito', sans-serif", color: darken(preview.color, 120),
            }}>
              {preview.title}
            </h3>
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {preview.items.map((item, i) => (
                <li key={i} style={{
                  display: "flex", alignItems: "flex-start", gap: "8px", marginBottom: "7px",
                  fontSize: "13px", color: darken(preview.color, 100), fontWeight: "600", lineHeight: "1.45",
                }}>
                  <span style={{
                    display: "inline-block", width: "14px", height: "14px", minWidth: "14px",
                    borderRadius: "4px", border: `2px solid ${darken(preview.color, 80)}`, marginTop: "2px",
                  }} />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <p style={{ fontSize: "12px", color: "#bbb", fontWeight: "600", marginTop: "10px", textAlign: "center" }}>
            Updates as you type
          </p>
        </div>

      </div>
    </div>
  );
}

const labelStyle = {
  display: "block", fontSize: "12px", fontWeight: "800", letterSpacing: "0.1em",
  textTransform: "uppercase", color: "#888", marginBottom: "8px", fontFamily: "'Nunito', sans-serif",
};

const inputStyle = {
  width: "100%", padding: "12px 14px", borderRadius: "10px", border: "2px solid #e0e0e0",
  fontSize: "14px", fontFamily: "'Nunito', sans-serif", fontWeight: "600", color: "#1a1a1a",
  background: "#fff", outline: "none", boxSizing: "border-box", transition: "border-color 0.15s",
};