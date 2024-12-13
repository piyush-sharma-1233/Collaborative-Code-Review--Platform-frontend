import { useAuth } from "../../context/AuthContext";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
    const { login } = useAuth();
    const [userName, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      if (!userName || !password) {
        alert("Please fill out all fields.");
        return;
      }

      try {
        const obj = {
          username: userName,
          password: password,
        }; 
        console.log(obj);
        const response = await axios.post("http://127.0.0.1:8000/api/auth/login/", obj);
        console.log(response.data);
        if (response.status === 200) {
          login(response.data);
          navigate("/");
        }
      } catch (error) {
        console.error("Login error:", error);
        setError("Invalid userName or password. Please try again.");
      }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100"> 
        <form
        onSubmit={handleSubmit}
        className="flex flex-col max-w-md w-full mx-auto p-6  bg-white shadow-md rounded-lg space-y-6"
      >
        <h1 className="text-2xl font-bold text-center text-gray-700">Login</h1>
        <div className="space-y-4">
          <input
            type="text"
            placeholder="userName"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        <button
          type="submit"
          className="w-full py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          Login
        </button>
      </form>
      </div>
      
    );
  };

  export default Login;
