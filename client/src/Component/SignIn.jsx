import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom"; // <-- add this import!

function SignIn(){
    const [user_fname, setF_name] = useState("");
    const [user_lname, setL_name] = useState("");
    const [email, set_mail] = useState("");
    const [pass, set_pass] = useState("");

    const onSubmitForm = async (e) => {
        e.preventDefault();
        try {
            const body = { user_fname, user_lname, email, pass };
            await fetch("http://localhost:5050/sign", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });
            window.location = "/";
        } catch (error) {
            console.log(error.message);
        }
    };

    return (
        <div className="container column-layout">
          <form className="login-form" onSubmit={onSubmitForm}>
            <h2>Enter your Information</h2>
            <input
              type="text"
              placeholder="First name"
              value={user_fname}
              onChange={(e) => setF_name(e.target.value)}
            />
            <input
              type="text"
              placeholder="Last name"
              value={user_lname}
              onChange={(e) => setL_name(e.target.value)}
            />
            <input
              type="text"
              placeholder="Email"
              value={email}
              onChange={(e) => set_mail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              value={pass}
              onChange={(e) => set_pass(e.target.value)}
            />
            <button type="submit">Create Account</button>
            <p>
              Already have an account? <Link to="/">Sign In</Link>
            </p>
          </form>
        </div>
      )
}

export default SignIn;