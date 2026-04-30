import { useState } from "react";
import axios from "axios";
import "./Auth.css";

function Login() {

  const [isSignup, setIsSignup] = useState(false);

  const [username, setUsername] = useState("");

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const [confirmPassword, setConfirmPassword] = useState("");

  // SIGNUP
  const signup = async () => {

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {

      await axios.post(
        "http://localhost:5000/signup",
        {
          username,
          email,
          password
        }
      );

      alert("Signup successful");

      setIsSignup(false);

    } catch (err) {

      alert("Signup failed");

    }
  };

  // LOGIN
  const login = async () => {

    try {

      const res = await axios.post(
        "http://localhost:5000/login",
        {
          email,
          password
        }
      );

      localStorage.setItem("token", res.data.token);

      alert("Login successful");

      window.location.reload();

    } catch (err) {

      alert("Invalid credentials");

    }
  };

  return (

    <div className="authContainer">

      <div className="authBox">

        <h1>
          {isSignup ? "Create Account" : "Welcome Back"}
        </h1>

        {isSignup && (
          <input
            type="text"
            placeholder="Username"
            onChange={(e) => setUsername(e.target.value)}
          />
        )}

        <input
          type="email"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />

        {isSignup && (
          <input
            type="password"
            placeholder="Confirm Password"
            onChange={(e) =>
              setConfirmPassword(e.target.value)
            }
          />
        )}

        <button
          onClick={isSignup ? signup : login}
        >
          {isSignup ? "Sign Up" : "Sign In"}
        </button>

        <p>

          {isSignup
            ? "Already have an account?"
            : "Don't have an account?"}

          <span
            onClick={() =>
              setIsSignup(!isSignup)
            }
          >

            {isSignup ? " Sign In" : " Sign Up"}

          </span>

        </p>

      </div>

    </div>
  );
}

export default Login;