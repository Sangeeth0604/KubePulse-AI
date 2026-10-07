import React, { useState } from "react";

import Dashboard from "./Dashboard";
import Login from "./Login";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const [theme, setTheme] = useState("dark");

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <>
      {isAuthenticated ? (
        <Dashboard theme={theme} toggleTheme={toggleTheme} />
      ) : (
        <Login onLogin={() => setIsAuthenticated(true)} />
      )}
    </>
  );
}

export default App;