import { Link, useNavigate } from "react-router-dom";
import "./Header.css";
import { supabase } from "../../services/supabase";
import {
  Leaf,
  LogIn,
  LogOut,
  Menu,
  Moon,
  Sparkles,
  Sun,
  User,
  X,
} from "lucide-react";
import QuoteModal from "../QuoteModal/QuoteModal";
import { toggleTheme } from "../../store/uiSlice";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function Header() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const theme = useSelector((state) => state.ui.theme);
  const user = useSelector((state) => state.auth.user);

  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { role } = useSelector((state) => state.auth);
  const handleLogout = async () => {
    // kill the session
    await supabase.auth.signOut();
    // clear redux state
    dispatch({ type: "auth/logoutUser" });

    setIsMenuOpen(false);
    navigate("/");
  };

  return (
    <>
      <header className="header-content">
        <Link to="/" className="header-title">
          <Leaf size={28} color="#2b6b39" />
          <h2> Starwood Library</h2>
        </Link>

        <div className="header-right">
          <nav
            className="desktop-only"
            style={{ gap: "0.5rem", alignItems: "center" }}
          >
            <Link to="/catalog" className="nav-link">
              Catalog
            </Link>
            <Link to="/contact" className="nav-link">
              Contact
            </Link>
            <div className="short-divider"></div>
          </nav>

          <div className="header-more-opt">
            <button
              className="icon-btn"
              onClick={() => setIsQuoteModalOpen(true)}
              title="Get a Quote"
            >
              <Sparkles size={20} />
            </button>

            <button
              className="icon-btn"
              onClick={() => dispatch(toggleTheme())}
              title="Toggle Theme"
            >
              {theme === "Sunlight" ? <Moon size={20} /> : <Sun size={20} />}
            </button>

            <div className="header-menu-wrp">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="icon-btn"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
              {isMenuOpen && (
                <div className="opened-menu">
                  <div className="mobile-only" id="mo-nav">
                    <Link
                      to="/catalog"
                      onClick={() => setIsMenuOpen(false)}
                      className="nav-link"
                    >
                      Catalog
                    </Link>
                    <Link
                      to="/contact"
                      onClick={() => setIsMenuOpen(false)}
                      className="nav-link"
                    >
                      Contact
                    </Link>
                  </div>
                  {role === "admin" && (
                    <Link
                      to="/admin/books"
                      className="nav-link"
                      onClick={() => setIsMenuOpen(false)}
                      style={{ color: "#e74c3c" }}
                    >
                      Admin Dashboard
                    </Link>
                  )}
                  {user ? (
                    <>
                      <Link
                        to="/profile"
                        onClick={() => setIsMenuOpen(false)}
                        className="nav-link"
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.5rem",
                        }}
                      >
                        <User size={16} /> Profile
                      </Link>

                      {/* REAL LOGOUT BUTTON */}
                      <button
                        onClick={handleLogout}
                        className="nav-link"
                        id="log"
                      >
                        <LogOut size={16} /> Logout
                      </button>
                    </>
                  ) : (
                    /* REAL LOGIN LINK (Replaces Mock Button) */
                    <Link
                      to="/login"
                      onClick={() => setIsMenuOpen(false)}
                      className="nav-link"
                      id="log"
                    >
                      <LogIn size={16} /> Login
                    </Link>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {isQuoteModalOpen && (
        <QuoteModal onClose={() => setIsQuoteModalOpen(false)} theme={theme} />
      )}
    </>
  );
}
