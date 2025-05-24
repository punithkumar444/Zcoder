import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const SignUp: React.FC = () => {
  const [form, setForm] = useState({
    username: "",
    firstName: "",
    lastName: "",
    password: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { fetchUser } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("/api/v1/user/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("firstname", data.firstName); // or however you get it
        await fetchUser(); // Updates context so navbar gets updated
        navigate("/questions");
      } else {
        setError(data.message || "Signup failed");
      }
    } catch (err) {
      setError("Signup error: " + (err as Error).message);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded shadow">
      <h2 className="text-2xl mb-4 font-bold">Sign Up</h2>
      {error && <p className="text-red-600 mb-3">{error}</p>}
      <form onSubmit={handleSubmit}>
        <label className="block mb-2">Email:</label>
        <input
          name="username"
          type="email"
          value={form.username}
          onChange={handleChange}
          required
          className="w-full p-2 mb-4 border rounded"
        />

        <label className="block mb-2">First Name:</label>
        <input
          name="firstName"
          type="text"
          value={form.firstName}
          onChange={handleChange}
          required
          className="w-full p-2 mb-4 border rounded"
        />

        <label className="block mb-2">Last Name:</label>
        <input
          name="lastName"
          type="text"
          value={form.lastName}
          onChange={handleChange}
          required
          className="w-full p-2 mb-4 border rounded"
        />

        <label className="block mb-2">Password:</label>
        <input
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          required
          minLength={6}
          className="w-full p-2 mb-4 border rounded"
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Sign Up
        </button>
      </form>
    </div>
  );
};

export default SignUp;
