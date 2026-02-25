import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { supabase } from "../services/supabase";
import { ArrowLeft, BookOpen, Heart, CheckCircle } from "lucide-react";
import {
  toggleFavorite,
  addToWantToRead,
  addToFinished,
} from "../store/userLibrarySlice";
import AuthGateModal from "../components/AuthGateModal/AuthGateModal.jsx";
import BookCard from "../components/BookCard/BookCard.jsx";
import "./BookDetailsPage.css";

export default function BookDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const user = useSelector((state) => state.auth.user);
  const { favorites, wantToRead, finished } = useSelector(
    (state) => state.userLibrary,
  );

  const [book, setBook] = useState(null);
  const [relatedCategory, setRelatedCategory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const isFav = book && favorites.includes(book.id);
  const isWant = book && wantToRead.includes(book.id);
  const isFinished = book && finished.includes(book.id);

  useEffect(() => {
    const fetchDetails = async () => {
      setIsLoading(true);
      const { data: mainBook } = await supabase
        .from("tomes")
        .select("*")
        .eq("id", id)
        .single();

      if (mainBook) {
        setBook(mainBook);
        const { data: catBooks } = await supabase
          .from("tomes")
          .select("*")
          .eq("category", mainBook.category)
          .neq("id", id)
          .limit(6);
        setRelatedCategory(catBooks || []);
      }
      setIsLoading(false);
    };
    fetchDetails();
    window.scrollTo(0, 0);
  }, [id]);

  const handleAction = (action) => {
    if (!user) setShowAuthModal(true);
    else action();
  };

  if (isLoading)
    return <div className="catalog-loading">Summoning details...</div>;
  if (!book) return <div className="catalog-error">Tome not found.</div>;

  return (
    <div className="details-page-wrapper">
      {/* page header on mobile */}
      <div className="details-mobile-header">
        <button onClick={() => navigate("/catalog")} className="icon-btn">
          <ArrowLeft size={22} />
        </button>
      </div>

      {/* main content */}
      <div className="details-content-grid">
        {/* left: cover */}
        <div className="details-cover-wrapper">
          <img
            src={book.coverUrl}
            alt={book.title}
            className="details-cover"
            onError={(e) =>
              (e.target.src = "https://via.placeholder.com/300x450")
            }
          />
        </div>

        {/* right: book info */}
        <div className="details-main-info">
          <h1 className="details-title">{book.title}</h1>
          <p className="details-author">by {book.author}</p>

          <div className="desktop-actions-row">
            <button
              className={`desktop-btn btn-want-read ${isWant ? "active-desktop" : ""}`}
              onClick={() =>
                handleAction(() => dispatch(addToWantToRead(book.id)))
              }
            >
              {isWant ? <CheckCircle size={18} /> : <BookOpen size={18} />}
              {isWant ? "On List" : "Want to Read"}
            </button>

            <button
              className={`desktop-btn btn-finish ${isFinished ? "active-desktop" : ""}`}
              onClick={() =>
                handleAction(() => dispatch(addToFinished(book.id)))
              }
            >
              <CheckCircle size={18} />
              {isFinished ? "Completed" : "Mark as Finished"}
            </button>

            <button
              className={`desktop-btn btn-fav ${isFav ? "active-desktop-fav" : ""}`}
              onClick={() =>
                handleAction(() => dispatch(toggleFavorite(book.id)))
              }
              style={{ padding: "0.8rem", minWidth: "auto" }}
            >
              <Heart size={20} fill={isFav ? "currentColor" : "none"} />
            </button>
          </div>

          {/* actions on mobile */}
          <div className="mobile-actions-grid">
            <button
              className={`mobile-action-item ${isWant ? "active" : ""}`}
              onClick={() =>
                handleAction(() => dispatch(addToWantToRead(book.id)))
              }
            >
              <div className="mobile-action-icon">
                <BookOpen size={20} />
              </div>
              <span>Read</span>
            </button>

            <button
              className={`mobile-action-item ${isFav ? "active" : ""}`}
              onClick={() =>
                handleAction(() => dispatch(toggleFavorite(book.id)))
              }
            >
              <div className="mobile-action-icon">
                <Heart size={20} fill={isFav ? "currentColor" : "none"} />
              </div>
              <span>Adore</span>
            </button>

            <button
              className={`mobile-action-item ${isFinished ? "active" : ""}`}
              onClick={() =>
                handleAction(() => dispatch(addToFinished(book.id)))
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

          {/* more info */}
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

          <div className="details-synopsis">
            <span className="section-label">Description</span>
            <p className="description-text">{book.description}</p>
          </div>
        </div>
      </div>

      {/* more recommended books */}
      {relatedCategory.length > 0 && (
        <div className="related-section">
          <div className="related-header">
            <div className="vertical-accent"></div>
            <h3>More {book.category} Books</h3>
          </div>

          <div className="scroll-row">
            {relatedCategory.map((b) => (
              <div key={b.id} className="scroll-item">
                <BookCard
                  book={b}
                  onGuestAction={() => setShowAuthModal(true)}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {showAuthModal && (
        <AuthGateModal
          onClose={() => setShowAuthModal(false)}
          onLogin={() => {
            navigate("/login");
            setShowAuthModal(false);
          }}
          onRegister={() => {
            navigate("/signup");
            setShowAuthModal(false);
          }}
        />
      )}
    </div>
  );
}
