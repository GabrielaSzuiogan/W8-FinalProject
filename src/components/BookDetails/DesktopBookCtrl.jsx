import { useDispatch, useSelector } from "react-redux";
import { Heart, BookOpen, CheckCircle } from "lucide-react";
import { toggleFavorite, updateBookStatus } from "../../store/userLibrarySlice";

export default function DesktopBookCtrl({ book, onGuestAction }) {
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
      <div className="desktop-actions-row">
        <button
          className={`desktop-btn btn-want-read ${isWant ? "active-desktop" : ""}`}
          onClick={() =>
            handleAction(() =>
              dispatch(
                updateBookStatus({ bookId: book.id, status: "want_to_read" }),
              ),
            )
          }
        >
          {isWant ? <CheckCircle size={18} /> : <BookOpen size={18} />}
          {isWant ? "On List" : "Want to Read"}
        </button>

        <button
          className={`desktop-btn btn-finish ${isFinished ? "active-desktop" : ""}`}
          onClick={() =>
            handleAction(() =>
              dispatch(
                updateBookStatus({ bookId: book.id, status: "finished" }),
              ),
            )
          }
        >
          <CheckCircle size={18} />
          {isFinished ? "Completed" : "Mark as Finished"}
        </button>

        <button
          className={`desktop-btn btn-fav ${isFav ? "active-desktop-fav" : ""}`}
          onClick={() => handleAction(() => dispatch(toggleFavorite(book.id)))}
          style={{ padding: "0.8rem", minWidth: "auto" }}
        >
          <Heart size={20} fill={isFav ? "currentColor" : "none"} />
        </button>
      </div>

      <div className="desktop-metadata-grid">
        <div className="meta-item">
          <h4>Rating</h4>
          <p>{"★".repeat(Math.round(book.sparkleRating || 0))}</p>
        </div>
        <div className="meta-item">
          <h4>Category</h4>
          <p>{book.category}</p>
        </div>
        <div className="meta-item">
          <h4>Published</h4>
          <p>{book.publishYear}</p>
        </div>
      </div>
    </>
  );
}
