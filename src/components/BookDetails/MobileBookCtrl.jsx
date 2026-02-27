import { useDispatch, useSelector } from "react-redux";
import { Heart, BookOpen, CheckCircle } from "lucide-react";
import { toggleFavorite, updateBookStatus } from "../../store/userLibrarySlice";

export default function MobileBookCtrl({ book, onGuestAction }) {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  const { favorites, wantToRead, finished } = useSelector(
    (state) => state.userLibrary,
  );

  const isFav = favorites.includes(String(book.id));
  const isWant = wantToRead.includes(String(book.id));
  const isFinished = finished.includes(String(book.id));

  const handleAction = (actionCallback) => {
    if (!user) {
      onGuestAction();
    } else {
      actionCallback();
    }
  };

  return (
    <>
      <div className="mobile-actions-grid">
        <button
          className={`mobile-action-item ${isWant ? "active" : ""}`}
          onClick={() =>
            handleAction(() =>
              dispatch(
                updateBookStatus({ bookId: book.id, status: "want_to_read" }),
              ),
            )
          }
        >
          <div className="mobile-action-icon">
            <BookOpen size={20} />
          </div>
          <span>Read</span>
        </button>

        <button
          className={`mobile-action-item ${isFav ? "active" : ""}`}
          onClick={() => handleAction(() => dispatch(toggleFavorite(book.id)))}
        >
          <div className="mobile-action-icon">
            <Heart size={20} fill={isFav ? "currentColor" : "none"} />
          </div>
          <span>Adore</span>
        </button>

        <button
          className={`mobile-action-item ${isFinished ? "active" : ""}`}
          onClick={() =>
            handleAction(() =>
              dispatch(
                updateBookStatus({ bookId: book.id, status: "finished" }),
              ),
            )
          }
        >
          <div className="mobile-action-icon">
            <CheckCircle size={20} />
          </div>
          <span>Finish</span>
        </button>
      </div>

      <div className="mobile-stats-card">
        <div className="mobile-stat-col">
          <span className="mobile-stat-label">RATING</span>
          <span className="mobile-stat-value" style={{ color: "#2f855a" }}>
            {"★".repeat(Math.round(book.sparkleRating || 0))}
          </span>
        </div>
        <div className="mobile-stat-col">
          <span className="mobile-stat-label">CATEGORY</span>
          <span className="mobile-stat-value" style={{ fontWeight: 700 }}>
            {book.category}
          </span>
        </div>
        <div className="mobile-stat-col">
          <span className="mobile-stat-label">PUBLISHED</span>
          <span className="mobile-stat-value" style={{ fontWeight: 700 }}>
            {book.publishYear}
          </span>
        </div>
      </div>
    </>
  );
}
