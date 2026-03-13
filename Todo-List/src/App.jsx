import { useState, useEffect } from "react";
import Home from "./pages/Home";
import Create from "./pages/Create";

const API_URL = "http://localhost:5000/api";

export default function App() {
  const [page,   setPage]   = useState("home");
  const [boards, setBoards] = useState([]);

  // Load boards from server when app starts
  useEffect(() => {
    fetch(`${API_URL}/boards`)
      .then((res) => res.json())
      .then((data) => setBoards(data))
      .catch((err) => console.error("Could not load boards:", err));
  }, []);

  const addBoard = (newBoard) => {
    setBoards((prev) => [newBoard, ...prev]);
    setPage("home");
  };

  const deleteBoard = async (id) => {
    await fetch(`${API_URL}/boards/${id}`, { method: "DELETE" });
    setBoards((prev) => prev.filter((b) => b._id !== id));
  };

  const toggleItem = async (boardId, itemIndex) => {
    const board = boards.find((b) => b._id === boardId);
    const updatedChecked = {
      ...(board.checked || {}),
      [itemIndex]: !(board.checked || {})[itemIndex],
    };
    await fetch(`${API_URL}/boards/${boardId}/checked`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ checked: updatedChecked }),
    });
    setBoards((prev) =>
      prev.map((b) =>
        b._id === boardId ? { ...b, checked: updatedChecked } : b
      )
    );
  };

  return (
    <div style={{
      fontFamily: "'Nunito', sans-serif",
      minHeight: "100vh",
      width: "100vw",
      background: "#F7F5F0",
      margin: 0, padding: 0, boxSizing: "border-box",
    }}>
      <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800&family=Playfair+Display:wght@700&display=swap" rel="stylesheet" />
      {page === "home" ? (
        <Home
          boards={boards}
          onNavigateCreate={() => setPage("create")}
          onDeleteBoard={deleteBoard}
          onToggleItem={toggleItem}
        />
      ) : (
        <Create onAdd={addBoard} onBack={() => setPage("home")} />
      )}
    </div>
  );
}