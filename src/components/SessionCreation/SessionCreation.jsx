import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const SessionCreation = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [sessionName, setSessionName] = useState("");
  const [codeFile, setCodeFile] = useState(null);
  const [reviewers, setReviewers] = useState([""]);
  const [errorMessage, setErrorMessage] = useState("");
  const [fileContent, setFileContent] = useState("");

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if(!file) {
      setErrorMessage(
        "No file selected. Please upload a file."
      );
      return;
    }
    // Valid MIME types for .js, .py, and .java files
    const validTypes = [
      "text/javascript", // For .js
      "text/x-python",          // For .py
      "text/x-java-source",     // For .java
    ];
  
    if (file && file?.type && validTypes.includes(file?.type)) {
      console.log("File type is valid.", file);
      const reader = new FileReader();
      reader.onload = (event) => {
        setFileContent(event.target.result);
      };
      reader.readAsText(file);
      setCodeFile(file);

      setErrorMessage("");
    } else {
      setErrorMessage(
        "Invalid file type. Please upload a .js, .py, or .java file."
      );
    }
  };
  
  const handleReviewerChange = (index, value) => {
    const updatedReviewers = [...reviewers];
    updatedReviewers[index] = value;
    setReviewers(updatedReviewers);
  };

  const addReviewerField = () => {
    setReviewers([...reviewers, ""]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!sessionName || !fileContent|| !codeFile || reviewers.some((email) => !email.trim())) {
      console.log("Please fill out all fields.", sessionName, fileContent, codeFile, reviewers);
      alert("Please fill out all fields.");
      return;
    }
      const sessionData = {
        sessionName,
        codeFile,
        reviewers,
        fileContent,
      };
      console.log(sessionData);
      if(user && user.tokens && user.tokens.access) {
        const token = user.tokens.access;
        console.log("token" , token);
        const response = await axios.post(
          "http://127.0.0.1:8000/api/sessions/",
          { sessionName: sessionData?.sessionName }, // Ensure it's an object
          {
            headers: {
              Authorization: `Bearer ${token}`, // Ensure the token is valid
            },
          }
        );
          console.log("Response:", response.data);
        console.log("Response:", response.data);
        if (response.status === 201) {
          alert("Session created successfully!");
          setSessionName("");
          setCodeFile(null);
          setReviewers([""]);
          setFileContent("");
          navigate("/");
        }
      }
      console.log("token" , user.tokens.access);

    
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Create a New Review Session</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium mb-2">Session Name</label>
          <input
            type="text"
            value={sessionName}
            onChange={(e) => setSessionName(e.target.value)}
            className="border w-full px-3 py-2 rounded"
          />
        </div>
        <div>
          <label className="block font-medium mb-2">Upload Code Snippet</label>
          <input
            type="file"
            accept=".js,.py,.java"
            onChange={(e) => handleFileChange(e)}
            className="block w-full"
          />
          {errorMessage && <p className="text-red-500 mt-2">{errorMessage}</p>}
        </div>
        <div>
          <label className="block font-medium mb-2">Reviewers' Emails</label>
          {reviewers.map((email, index) => (
            <div key={index} className="flex space-x-2 mb-2">
              <input
                value={email}
                onChange={(e) => handleReviewerChange(index, e.target.value)}
                className="border flex-1 px-3 py-2 rounded"
              />
              {index === reviewers.length - 1 && (
                <button
                  type="button"
                  onClick={addReviewerField}
                  className="bg-blue-500 text-white px-3 py-2 rounded"
                >
                  +
                </button>
              )}
            </div>
          ))}
        </div>
        <button
          type="submit"
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Create Session
        </button>
      </form>
    </div>
  );
};

export default SessionCreation;
