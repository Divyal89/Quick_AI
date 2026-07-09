import React, { use, useState } from "react";
import "../auth.form.scss";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import LoadingScreen from "../../interview/pages/LoadingScreen";

const Login = () => {
  const navigate = useNavigate();
  const { loading, handleLogin } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Control not to refresh the page again and again on clicking a button
  const handleSubmit = async (e) => {
    e.preventDefault();

    const success = await handleLogin({
      email,
      password,
    });

    if (success) {
      navigate("/");
    }
  };

  if (loading) {
    return (
      <main>
        <LoadingScreen />
      </main>
    );
  }

  return (
    <main>
      <div className="form-container">
        <h1>Login</h1>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              type="email"
              id="email"
              name="email"
              placeholder="Enter email address"
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              type="password"
              id="password"
              name="password"
              placeholder="Enter Password"
              required
            />
          </div>

          <button className="button primary-button" disabled={loading}>
            {loading ? (
              <>
                <span className="loader"></span>
                Signing In...
              </>
            ) : (
              "Login"
            )}
          </button>
        </form>

        <p>
          Don't have an account? <Link to={"/register"}>Register</Link>
        </p>
      </div>
    </main>
  );
};

export default Login;
