import { useLocation, useNavigate } from "react-router-dom";
import { Key } from "lucide-react";
import LoginForm from "../components/Auth/LoginForm";
import SignupForm from "../components/Auth/SignupForm";
import "./AuthPage.css";

export default function AuthPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const isSignup = location.pathname === "/signup";

  const toggleMode = () => {
    if (isSignup) navigate("/login");
    else navigate("/signup");
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-icon-circle">
            <Key size={32} />
          </div>
          <h1>{isSignup ? "Join the Circle" : "Welcome Back"}</h1>
          <p>
            {isSignup
              ? "Register your name to enter."
              : "The library awaits, wizard."}
          </p>
        </div>

        {isSignup ? <SignupForm /> : <LoginForm />}

        <div className="auth-footer">
          <p>
            {isSignup ? "Already a wizard?" : "First time here?"}
            <button onClick={toggleMode} className="toggle-btn">
              {isSignup ? "Log In" : "Create Account"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
