import React, { useState } from "react";
import Login from "./components/Login";
import GanttChart from "./components/GanttChart";

const App = () => {
  const [user, setUser] = useState(null); // Manage user state

  const handleLoginSuccess = (userData) => {
    setUser(userData); // Update the user state after login
  };

  return (
    <div>
      {!user ? (
        <Login onLoginSuccess={handleLoginSuccess} /> // Show login page if no user
      ) : (
        <GanttChart user={user} /> // Show Gantt chart if logged in
      )}
    </div>
  );
};

export default App;
