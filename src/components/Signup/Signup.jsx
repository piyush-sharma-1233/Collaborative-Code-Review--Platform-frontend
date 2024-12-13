import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Signup = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({ username: "", email: "", password: "" });
  const navigate = useNavigate();

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !email || !password) {
      setErrors((prev) => ({
        ...prev,
        username: !username ? "Username is required." : "",
        email: !email ? "Email is required." : validateEmail(email) ? "" : "Invalid email format.",
        password: !password ? "Password is required." : "",
      }));
      return;
    }

    try {
        const response = await axios.post("http://127.0.0.1:8000/api/auth/signup/", {
            username,
            email,
            password,
          });
          console.log("Signup response:", response.data);
      alert("Signup successful! You can now log in.");
      navigate("/login");
    } catch (error) {
      console.error("Signup error:", error);
      alert("An error occurred during signup. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col w-96 mx-auto p-6 bg-white shadow-md rounded-lg space-y-6"
      >
        <h1 className="text-2xl font-bold text-center text-gray-700">Signup</h1>
        <div className="space-y-4">
          <div>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                setErrors((prev) => ({ ...prev, username: e.target.value ? "" : "Username is required." }));
              }}
              className={`w-full px-4 py-2 border ${errors.username ? "border-red-500" : "border-gray-300"} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
            />
            {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username}</p>}
          </div>
          <div>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setErrors((prev) => ({
                  ...prev,
                  email: e.target.value
                    ? validateEmail(e.target.value)
                      ? ""
                      : "Invalid email format."
                    : "Email is required.",
                }));
              }}
              className={`w-full px-4 py-2 border ${errors.email ? "border-red-500" : "border-gray-300"} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>
          <div>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setErrors((prev) => ({ ...prev, password: e.target.value ? "" : "Password is required." }));
              }}
              className={`w-full px-4 py-2 border ${errors.password ? "border-red-500" : "border-gray-300"} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
            />
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
          </div>
        </div>
        <button
          type="submit"
          disabled={Object.values(errors).some((error) => error) || !username || !email || !password}
          className={`w-full py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 ${
            Object.values(errors).some((error) => error) || !username || !email || !password
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-500 text-white hover:bg-blue-600"
          }`}
        >
          Signup
        </button>
      </form>
    </div>
  );
};

export default Signup;
