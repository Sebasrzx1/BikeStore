import React, { useState } from "react";
import LoginForm from "./components/LoginForm/LoginForm.jsx";
import RegisterForm from "./components/RegisterForm/RegisterForm.jsx";

export default function App() {
  const [isRegistering, setIsRegistering] = useState(false);

  return (
    <div>
      {isRegistering ? (
        <RegisterForm setIsRegistering={setIsRegistering} />
      ) : (
        <LoginForm setIsRegistering={setIsRegistering} />
      )}
    </div>
  );
}
