import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../services/supabase";
import { setUser } from "../../store/authSlice";
import { Mail, Lock, ArrowRight, Loader } from "lucide-react";
import "./AuthForm.css";

export default function LoginForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ email: "", password: "" });
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
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (error) throw error;

      if (data.session) {
        // Fetch Role
        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", data.user.id)
          .single();

        dispatch(
          setUser({
            user: data.user,
            role: profile?.role || "user",
          }),
        );

        navigate("/catalog");
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
          <Mail size={16} /> Email Spell
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
          <Lock size={16} /> Secret Key
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
            Unlock Library <ArrowRight size={18} />
          </>
        )}
      </button>
    </form>
  );
}
