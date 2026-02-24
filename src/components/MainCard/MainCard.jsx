import { Link } from "react-router-dom";
import "./MainCard.css";

export default function MainCard({
  icon,
  title,
  description,
  buttonText,
  linkTo,
}) {
  return (
    <div className="card" id="main-card">
      {icon && <div className="icon-wrp">{icon}</div>}
      <h1 className="main-title">{title}</h1>
      <p className="main-descr"> {description}</p>
      {linkTo && buttonText && (
        <Link to={linkTo} style={{ textDecoration: "none" }}>
          <button className="btn-primary">{buttonText}</button>
        </Link>
      )}
    </div>
  );
}
