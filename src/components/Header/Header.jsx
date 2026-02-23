import { Link } from "react-router-dom";
import "./Header.css";
import { Menu, Sparkles, Sun } from "lucide-react";

export default function Header() {
  return (
    <>
      <header className="header-content">
        <Link to="/" className="header-title">
          <h2> Starwood Library</h2>
        </Link>

        <nav className="header-navigation">
          <Link to="/catalog">Catalog</Link>
          <Link to="/contact">Contact</Link>
        </nav>

        <div className="header-more-opt">
          <button className="quote-button">
            <Sparkles size={16} /> Oracle
          </button>

          <button className="theme-button">
            <Sun size={20} />
          </button>

          <div className="header-menu-wrp">
            <button className="menu-buttn">
              <Menu size={24} />
            </button>
          </div>
        </div>
      </header>
    </>
  );
}
