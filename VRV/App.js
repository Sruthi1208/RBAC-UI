import React, { useState } from "react";
import axios from "axios";
import jwt_decode from "jwt-decode";

const App = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [token, setToken] = useState(null);

  const register = async () => {
    try {
      await axios.post("http://127.0.0.1:5000/register", { username, password, role });
      alert("User registered successfully");
    } catch (err) {
      console.error(err);
      alert("Registration failed");
    }
  };

  const login = async () => {
    try {
      const response = await axios.post("http://127.0.0.1:5000/login", { username, password });
      setToken(response.data.access_token);
    } catch (err) {
      console.error(err);
      alert("Login failed");
    }
  };

  const accessProtected = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:5000/protected", {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert(response.data.message);
    } catch (err) {
      console.error(err);
      alert("Access denied");
    }
  };

  const accessAdmin = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:5000/admin", {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert(response.data.message);
    } catch (err) {
      console.error(err);
      alert("Admin access denied");
    }
  };

  const decodeToken = () => {
    if (token) {
      const decoded = jwt_decode(token);
      return `Logged in as ${decoded.username} with role ${decoded.role}`;
    }
    return "Not logged in";
  };

  return (
    <div>
      <h1>RBAC Example</h1>
      <div>
        <h2>Register</h2>
        <input placeholder="Username" onChange={(e) => setUsername(e.target.value)} />
        <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
        <input placeholder="Role (Admin/User)" onChange={(e) => setRole(e.target.value)} />
        <button onClick={register}>Register</button>
      </div>
      <div>
        <h2>Login</h2>
        <input placeholder="Username" onChange={(e) => setUsername(e.target.value)} />
        <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
        <button onClick={login}>Login</button>
      </div>
      <div>
        <h2>Actions</h2>
        <button onClick={accessProtected}>Access Protected Resource</button>
        <button onClick={accessAdmin}>Access Admin Resource</button>
      </div>
      <h3>{decodeToken()}</h3>
    </div>
  );
};

export default App;