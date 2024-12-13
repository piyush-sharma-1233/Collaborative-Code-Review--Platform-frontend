import React, { useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { a11yDark } from "react-syntax-highlighter/dist/esm/styles/hljs";

const CodeReview = () => {
  const [comments, setComments] = useState([]);
  const sessionCreation = JSON.parse(localStorage.getItem("SESSION_CREATION"));
  const [selectedLine, setSelectedLine] = useState(null);
  const codeSnippet = `function helloWorld() {
    console.log("Hello, World!");
}`;

  const addComment = (line, text) => {
    setComments([...comments, { line, text, resolved: false }]);
  };

  const resolveComment = (index) => {
    setComments(
      comments.map((comment, i) =>
        i === index ? { ...comment, resolved: true } : comment
      )
    );
  };
  const handleLineClick = (lineNumber) => {
    console.log("Clicked line:", lineNumber);
    setSelectedLine(lineNumber);
    // Add your logic here to handle the line click event
  };
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Code Review</h1>
      <SyntaxHighlighter
        language="javascript"
        style={a11yDark}
        showLineNumbers
        wrapLines
        lineProps={(lineNumber) => ({
          onClick: () => handleLineClick(lineNumber),
          style: {
            cursor: "pointer",
            backgroundColor: selectedLine === lineNumber ? "lightblue" : "transparent",
          },
        })}
      >
        {sessionCreation ? sessionCreation.fileContent : null}
      </SyntaxHighlighter>
      <div>
        {comments.map((comment, index) => (
          <div
            key={index}
            className={`mt-2 p-2 ${
              comment.resolved ? "bg-green-100" : "bg-red-100"
            }`}
          >
            <p>
              Line {comment.line}: {comment.text}
            </p>
            {!comment.resolved && (
              <button
                onClick={() => resolveComment(index)}
                className="bg-blue-500 text-white px-2 py-1 rounded"
              >
                Resolve
              </button>
            )}
          </div>
        ))}
      </div>
      <button
        onClick={() => addComment(selectedLine, "Add error handling here.")}
        className="bg-gray-500 text-white px-4 py-2 rounded mt-4"
      >
        Add Comment
      </button>
    </div>
  );
};

export default CodeReview;
