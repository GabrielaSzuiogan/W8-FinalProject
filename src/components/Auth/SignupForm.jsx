import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../services/supabase";
import { setUser } from "../../store/authSlice";
import { User, Mail, Lock, ArrowRight, Loader } from "lucide-react";
import "./AuthForm.css";

export default function SignupForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            username: formData.username,
          },
        },
      });

      if (error) throw error;

      if (data.session) {
        dispatch(
          setUser({
            user: data.user,
            role: "user",
          }),
        );
        navigate("/catalog");
      } else {
        alert("Owl sent! Please check your email to confirm your magic.");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="auth-form">
      <div className="form-group">
        <label>
          <User size={16} /> Username
        </label>
        <input
          type="text"
          name="username"
          placeholder="Merlin The Great"
          value={formData.username}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label>
          <Mail size={16} /> Email
        </label>
        <input
          type="email"
          name="email"
          placeholder="merlin@camelot.com"
          value={formData.email}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label>
          <Lock size={16} /> Password
        </label>
        <input
          type="password"
          name="password"
          placeholder="••••••••"
          value={formData.password}
          onChange={handleChange}
          required
        />
      </div>

      {error && <div className="auth-error">{error}</div>}

      <button
        type="submit"
        className="btn-primary auth-btn"
        disabled={isLoading}
      >
        {isLoading ? (
          <Loader className="spin" />
        ) : (
          <>
            Cast Registration <ArrowRight size={18} />
          </>
        )}
      </button>
    </form>
  );
}
