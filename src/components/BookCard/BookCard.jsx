import { useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Heart, Plus, CheckCircle, BookOpen } from "lucide-react";
import {
  toggleFavorite,
  addToWantToRead,
  addToFinished,
} from "../../store/userLibrarySlice";
import "./BookCard.css";

export default function BookCard({ book, onGuestAction }) {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  const isFav = useSelector((state) =>
    state.userLibrary.favorites.includes(book.id),
  );
  const isWant = useSelector((state) =>
    state.userLibrary.wantToRead.includes(book.id),
  );
  const isFinished = useSelector((state) =>
    state.userLibrary.finished.includes(book.id),
  );

  const [showMenu, setShowMenu] = useState(false);

  // check auth
  const handleAction = (actionCallback) => {
    if (!user) {
      onGuestAction();
    } else {
      actionCallback();
    }
  };

  return (
    <div className="card tome-card">
      {/* image */}
      <div className="tome-cover-container" style={{ position: "relative" }}>
        <Link to={`/catalog/${book.id}`} className="tome-img-link">
          <img
            src={book.coverUrl}
            alt={book.title}
            onError={(e) => {
              e.target.src =
                "https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&w=500&q=80";
            }}
            className="tome-cover-img"
          />
        </Link>

        <button
          className="tome-heart-btn"
          onClick={(e) => {
            e.stopPropagation();
            handleAction(() => dispatch(toggleFavorite(book.id)));
          }}
          style={{
            color: isFav ? "#e53e3e" : "var(--text-muted)",
          }}
        >
          <Heart size={18} fill={isFav ? "currentColor" : "none"} />
        </button>
      </div>

      {/* content */}
      <div className="tome-content">
        <Link to={`/catalog/${book.id}`} className="tome-content-link">
          <h3 className="tome-title">{book.title}</h3>
          <p className="tome-author">{book.author}</p>
        </Link>

        <div className="tome-card-rating">
          {"★".repeat(Math.round(book.sparkleRating || 0))}
        </div>

        <div className="tome-footer-wrp">
          <span className="tome-category">{book.category}</span>

          {/* add to btn */}
          <div style={{ position: "relative" }}>
            <button
              className="btn-primary"
              style={{ padding: "0.4rem 0.8rem", borderRadius: "12px" }}
              onClick={(e) => {
                e.stopPropagation();
                handleAction(() => setShowMenu(!showMenu));
              }}
            >
              {isFinished ? (
                <CheckCircle size={18} />
              ) : isWant ? (
                <BookOpen size={18} />
              ) : (
                <Plus size={18} />
              )}
            </button>

            {/* open menu */}
            {showMenu && (
              <div className="tome-dropdown-menu">
                <div className="tome-dropdown-title">Add to list:</div>

                <button
                  onClick={() => {
                    dispatch(addToWantToRead(book.id));
                    setShowMenu(false);
                  }}
                  className="icon-btn tome-rf"
                >
                  <BookOpen size={25} style={{ marginRight: "8px" }} /> Want to
                  Read
                </button>

                <button
                  onClick={() => {
                    dispatch(addToFinished(book.id));
                    setShowMenu(false);
                  }}
                  className="icon-btn tome-rf"
                >
                  <CheckCircle size={16} style={{ marginRight: "8px" }} />{" "}
                  Finished!
                </button>
              </div>
            )}

            {showMenu && (
              <div
                className="tome-dropdown-close"
                onClick={() => setShowMenu(false)}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
