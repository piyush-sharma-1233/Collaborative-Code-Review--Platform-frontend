import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch sessions from the API or use local data
  useEffect(() => {
    const fetchSessions = async () => {
      try {
        if(user && user?.tokens && user?.tokens?.access) {
          console.log("user" , user.tokens.access); 
          const token = user.tokens.access; 
          console.log("token" , token);
          const response = await axios.get("http://127.0.0.1:8000/api/sessions/", {
            headers: {
              Authorization: `Bearer ${"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzM0MTE0MzQyLCJpYXQiOjE3MzQxMTA3NDIsImp0aSI6ImQzNTc5NDVhNDYwNTRlOTM5YTZlYzU0M2VkYjFhYzY2IiwidXNlcl9pZCI6Mn0.N-eZ_f4ZWEgkDz6pjwH-2Vfme_6RGiePM2SF1tbY_g8"}`, // Ensure the token is valid
            },
          });
          setSessions(response.data); // Assuming response.data contains the sessions array
        }

      } catch (err) {
        setError("Failed to fetch sessions. Please try again later.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, [user]);

  // Check for session creation in local storage
  useEffect(() => {
    const sessionCreation = JSON.parse(localStorage.getItem("SESSION_CREATION"));

    if (sessionCreation) {
      setSessions((prevSessions) => {
        const newSession = {
          id: prevSessions.length + 1,
          name: `Session ${prevSessions.length + 1}`,
          createdBy: sessionCreation.sessionName || "You",
          totalReviewers: sessionCreation?.reviewers?.length || 0,
          status: "Pending",
          creationDate: new Date().toISOString().split("T")[0],
          fileContent: sessionCreation.fileContent,
        };
        return [...prevSessions, newSession];
      });

      // Clear the session creation data to avoid duplication
      localStorage.removeItem("SESSION_CREATION");
    }
  }, []);

  const handleCreateSession = () => {
    navigate("/session-creation");
  };

  const handleDeleteSession = (id) => {
    if (window.confirm("Are you sure you want to delete this session?")) {
      setSessions(sessions.filter((session) => session.id !== id));
    }
  };

  const handleUpdateStatus = (id, newStatus) => {
    setSessions((prevSessions) =>
      prevSessions.map((session) =>
        session.id === id ? { ...session, status: newStatus } : session
      )
    );
  };

  if (loading) {
    return <div>Loading sessions...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <button
        onClick={handleCreateSession}
        className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
      >
        Create New Session
      </button>
      {sessions.length === 0 ? (
        <p>No sessions available. Please create a new session.</p>
      ) : (
        <table className="w-full border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border px-4 py-2">Session Name</th>
              <th className="border px-4 py-2">Created By</th>
              <th className="border px-4 py-2">Total Reviewers</th>
              <th className="border px-4 py-2">Status</th>
              <th className="border px-4 py-2">Creation Date</th>
              <th className="border px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sessions.map((session) => (
              <tr key={session.id}>
                <td className="border px-4 py-2">{session.name}</td>
                <td className="border px-4 py-2">{session.createdBy}</td>
                <td className="border px-4 py-2">{session.totalReviewers}</td>
                <td className="border px-4 py-2">{session.status}</td>
                <td className="border px-4 py-2">{session.creationDate}</td>
                <td className="border px-4 py-2">
                  <button
                    onClick={() => navigate(`/review/${session.id}`)}
                    className="bg-green-500 text-white px-3 py-1 rounded mr-2"
                  >
                    Join
                  </button>
                  <button
                    onClick={() => handleDeleteSession(session.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded mr-2"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(session.id, "Completed")}
                    className="bg-yellow-500 text-white px-3 py-1 rounded"
                  >
                    Mark as Completed
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Dashboard;
