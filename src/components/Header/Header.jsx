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

        <div
          style={{
            width: "1px",
            height: "24px",
            backgroundColor: "var(--divider-color)",
          }}
        ></div>

        <div className="header-more-opt">
          <button className="icon-btn">
            <Sparkles size={16} /> Oracle
          </button>

          <button className="icon-btn">
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
