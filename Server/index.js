const express = require("express");
const cors    = require("cors");

const app  = express();
const PORT = process.env.PORT || 5000;

// ── In-memory "database" — just a plain array ─────────────────────────────────
let boards = [];

// ── Middleware ─────────────────────────────────────────────────────────────────
app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

// ── Routes ─────────────────────────────────────────────────────────────────────

// GET all boards
app.get("/api/boards", (req, res) => {
  res.json(boards);
});

// POST create a new board
app.post("/api/boards", (req, res) => {
  const { title, color, items } = req.body;
  const newBoard = {
    _id: Date.now().toString(),
    title,
    color,
    items: items || [],
    checked: {},
  };
  boards.unshift(newBoard); // add to front of array
  res.status(201).json(newBoard);
});

// DELETE a board
app.delete("/api/boards/:id", (req, res) => {
  boards = boards.filter((b) => b._id !== req.params.id);
  res.json({ message: "Deleted" });
});

// PATCH update checked tasks
app.patch("/api/boards/:id/checked", (req, res) => {
  const board = boards.find((b) => b._id === req.params.id);
  if (!board) return res.status(404).json({ message: "Board not found" });
  board.checked = req.body.checked;
  res.json(board);
});

// ── Start server ───────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`🚀  Server running on http://localhost:${PORT}`);
});