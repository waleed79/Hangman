import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Login from "./components/login";
import SignUp from "./components/sign_up";
import Hangman from "./hangman";

interface User {
  username: string;
  password: string;
  email: string;
}

const App: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);

  const handleSignUp = async (newUser: User) => {
    // check if username is already taken
    const existingUser = users.find(
      (user) => user.username === newUser.username
    );
    if (existingUser) {
      alert("This username is already taken. Please choose another one.");
      return;
    }

    // check password requirements
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
    if (!passwordRegex.test(newUser.password)) {
      alert(
        "Password should have at least 8 characters, one uppercase letter, and one number. Please choose a different password."
      );
      return;
    }

    try {
      // send new user data to backend
      const response = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUser),
      });

      if (response.ok) {
        // add new user to frontend state
        const savedUser = await response.json();
        setUsers([...users, savedUser]);
        alert("Account created successfully. Please log in.");
      } else {
        const error = await response.json();
        alert(`Failed to create account. ${error.message}`);
      }
    } catch (error: any) {
      alert(`Failed to create account. ${error.message}`);
    }
  };

  const handleLogin = async (username: string, password: string) => {
    try {
      // send login data to backend
      const response = await fetch(
        `/api/users?username=${username}&password=${password}`
      );

      if (response.ok) {
        alert(`Welcome back, ${username}!`);
      } else {
        const error = await response.json();
        alert(`Invalid login credentials. ${error.message}`);
      }
    } catch (error: any) {
      alert(`Failed to log in. ${error.message}`);
    }
  };

  return (
    <div>
      <Router>
        <Routes>
          <Route path="/hangman" element={<Hangman />} />
          <Route path="/" element={<Login onSubmit={handleLogin} />}></Route>
          <Route path="/signup" element={<SignUp onSubmit={handleSignUp} />} />
        </Routes>
        <Link to="/signup">
          <button>New user? Sign up</button>
        </Link>
      </Router>
    </div>
  );
};

export default App;
