import { useState } from "react";

function darken(hex, amount = 30) {
  const num = parseInt(hex.replace("#", ""), 16);
  const r = Math.max(0, (num >> 16) - amount);
  const g = Math.max(0, ((num >> 8) & 0xff) - amount);
  const b = Math.max(0, (num & 0xff) - amount);
  return `rgb(${r},${g},${b})`;
}

function StickyCard({ board, onDelete, onToggleItem }) {
  const [hovered, setHovered] = useState(false);
  const checked = board.checked || {};

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: board.color,
        borderRadius: "16px",
        padding: "24px",
        minHeight: "200px",
        position: "relative",
        boxShadow: hovered ? "0 12px 32px rgba(0,0,0,0.13)" : "0 4px 14px rgba(0,0,0,0.07)",
        transform: hovered ? "translateY(-4px)" : "translateY(0)",
        transition: "all 0.22s cubic-bezier(.4,0,.2,1)",
        cursor: "default",
      }}
    >
      {/* Delete button */}
      <button
        onClick={() => onDelete(board._id)}
        style={{
          position: "absolute", top: "12px", right: "14px",
          background: "none", border: "none", fontSize: "18px",
          cursor: "pointer", color: darken(board.color, 80),
          opacity: hovered ? 1 : 0, transition: "opacity 0.18s",
          lineHeight: 1, padding: "2px 5px", borderRadius: "6px",
        }}
      >×</button>

      {/* Title */}
      <h3 style={{
        margin: "0 0 14px 0", fontSize: "15px", fontWeight: "800",
        fontFamily: "'Nunito', sans-serif", color: darken(board.color, 120),
        letterSpacing: "0.01em",
      }}>
        {board.title}
      </h3>

      {/* Items */}
      <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
        {board.items.map((item, i) => (
          <li
            key={i}
            onClick={() => onToggleItem(board._id, i)}
            style={{
              display: "flex", alignItems: "flex-start", gap: "8px",
              marginBottom: "7px", fontSize: "13px",
              color: checked[i] ? darken(board.color, 60) : darken(board.color, 100),
              textDecoration: checked[i] ? "line-through" : "none",
              cursor: "pointer", transition: "color 0.15s",
              fontWeight: "600", lineHeight: "1.45",
            }}
          >
            <span style={{
              display: "inline-block", width: "14px", height: "14px", minWidth: "14px",
              borderRadius: "4px", border: `2px solid ${darken(board.color, 80)}`,
              background: checked[i] ? darken(board.color, 60) : "transparent",
              marginTop: "2px", transition: "background 0.15s",
            }} />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Home({ boards, onNavigateCreate, onDeleteBoard, onToggleItem }) {
  return (
    <div style={{
      width: "100%",
      minHeight: "100vh",
      background: "#F7F5F0",
      boxSizing: "border-box",
    }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "48px 40px" }}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: "40px" }}>
          <div>
            <p style={{ margin: "0 0 4px", fontSize: "12px", fontWeight: "700", letterSpacing: "0.12em", color: "#aaa", textTransform: "uppercase" }}>
              My Workspace
            </p>
            <h1 style={{
              margin: 0, fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(28px, 4vw, 48px)", fontWeight: "700",
              color: "#1a1a1a", letterSpacing: "-0.02em",
            }}>
              Sticky Wall
            </h1>
          </div>

          <button
            onClick={onNavigateCreate}
            style={{
              background: "#1a1a1a", color: "#fff", border: "none",
              borderRadius: "12px", padding: "12px 22px", fontSize: "14px",
              fontWeight: "700", fontFamily: "'Nunito', sans-serif",
              cursor: "pointer", display: "flex", alignItems: "center", gap: "8px",
              boxShadow: "0 4px 14px rgba(0,0,0,0.18)", transition: "transform 0.15s, box-shadow 0.15s",
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.22)"; }}
            onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 14px rgba(0,0,0,0.18)"; }}
          >
            <span style={{ fontSize: "20px", lineHeight: 1 }}>+</span> New Board
          </button>
        </div>

        {/* Stats */}
        <div style={{ display: "flex", gap: "16px", marginBottom: "40px" }}>
          {[
            { label: "Boards",      value: boards.length },
            { label: "Total Tasks", value: boards.reduce((a, b) => a + b.items.length, 0) },
            { label: "Done",        value: boards.reduce((a, b) => a + Object.values(b.checked || {}).filter(Boolean).length, 0) },
          ].map((stat) => (
            <div key={stat.label} style={{
              background: "#fff", borderRadius: "12px", padding: "12px 24px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
              display: "flex", gap: "8px", alignItems: "center",
            }}>
              <span style={{ fontSize: "22px", fontWeight: "800", color: "#1a1a1a" }}>{stat.value}</span>
              <span style={{ fontSize: "12px", color: "#888", fontWeight: "600" }}>{stat.label}</span>
            </div>
          ))}
        </div>

        {/* Grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
          gap: "24px",
        }}>
          {boards.map((board) => (
            <StickyCard
              key={board._id}
              board={board}
              onDelete={onDeleteBoard}
              onToggleItem={onToggleItem}
            />
          ))}

          {/* Add placeholder */}
          <div
            onClick={onNavigateCreate}
            style={{
              borderRadius: "16px", minHeight: "200px",
              border: "2.5px dashed #d0cfc8",
              display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center",
              cursor: "pointer", color: "#bbb", gap: "8px",
              transition: "border-color 0.18s, color 0.18s",
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "#999"; e.currentTarget.style.color = "#888"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "#d0cfc8"; e.currentTarget.style.color = "#bbb"; }}
          >
            <span style={{ fontSize: "36px", lineHeight: 1 }}>+</span>
            <span style={{ fontSize: "13px", fontWeight: "700" }}>Add Board</span>
          </div>
        </div>
      </div>
    </div>
  );
}