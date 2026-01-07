import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function InputTodo({ userId }) {
  const [project_name, setProjname] = useState("");
  const [description, setDesc] = useState("");
  const [start_date, setS_Date] = useState("");
  const [due_date, setD_Date] = useState("");
  const [showLogoutPopup, setShowLogoutPopup] = useState(false); // 👈 New state
  const navigate = useNavigate();

  const onSubmitForm = async (e) => {
    e.preventDefault();
    try {
      const body = { project_name, description, start_date, due_date, user_id: userId };
      await fetch("http://localhost:5050/todos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      window.location = `/Todo/${userId}`;
    } catch (error) {
      console.log(error.message);
    }
  };

  // 👇 Updated sign-out function
  const handleSignOut = () => {
    setShowLogoutPopup(true); // Show popup
    setTimeout(() => {
      setShowLogoutPopup(false); // Hide it
      navigate("/"); // Redirect to login
    }, 1500);
  };

  return (
    <div className="full-page-layout">
      <header className="header">
        <h1 className="logo">NotiTask</h1>
        <div className="user-profile">
          <div className="user-text">
            <strong>UserID</strong>
            <span>{userId}</span>
          </div>
          <img
            src="https://i.pravatar.cc/40"
            alt="User Avatar"
            className="avatar"
            onClick={handleSignOut}
            style={{ cursor: "pointer" }}
            title="Click to sign out"
          />
        </div>
      </header>

      {/* 👇 Logout Popup JSX */}
      {showLogoutPopup && (
        <div className="logout-popup">
          <p>You have been logged out.</p>
        </div>
      )}

      <main className="task-section">
        <div className="task-container">
          <h2 className="task-title">Your Tasks</h2>
          <form className="task-form" onSubmit={onSubmitForm}>
            <input
              type="text"
              placeholder="Project's name"
              value={project_name}
              onChange={(e) => setProjname(e.target.value)}
            />
            <input
              type="text"
              placeholder="Description"
              value={description}
              onChange={(e) => setDesc(e.target.value)}
            />
            <input
              type="date"
              value={start_date}
              onChange={(e) => setS_Date(e.target.value)}
            />
            <input
              type="date"
              value={due_date}
              onChange={(e) => setD_Date(e.target.value)}
            />
            <button type="submit">+ New Task</button>
          </form>
          <hr className="separator" />
        </div>
      </main>
    </div>
  );
}

export default InputTodo;