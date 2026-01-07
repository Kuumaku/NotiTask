import { useNavigate } from "react-router-dom";
import { useState } from "react";

function LogIn() {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5050/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, pass })
      });

      const data = await res.json();
      if (data.user_id) {
        console.log("User ID:", data.user_id); // ตรวจสอบค่า user_id ที่ได้มา
        localStorage.setItem("user_id", data.user_id);
        navigate(`/Todo/${data.user_id}`);
      } else {
        alert("Invalid credentials");
      }
    } catch (error) {
      console.error("Login error:", error.message);
    }
  };

  return (
    <div className="container">
      <h1 className="app-title">NotiTask</h1>
      <form className="login-form" onSubmit={handleLogin}>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
        />
        <input
          type="password"
          value={pass}
          onChange={(e) => setPass(e.target.value)}
          placeholder="Password"
        />
        <button type="submit">Login</button>
        <p>Don't have an account? <a onClick={() => navigate("/signIn")}>Sign up</a></p>
      </form>
    </div>
  );
}

export default LogIn;
