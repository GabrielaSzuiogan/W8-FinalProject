import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { supabase } from "../services/supabase";
import { Sparkles } from "lucide-react";
import BookCard from "../components/BookCard/BookCard.jsx";
import "./ProfilePage.css";

export default function ProfilePage() {
  const user = useSelector((state) => state.auth.user);
  const { favorites, wantToRead, finished } = useSelector(
    (state) => state.userLibrary,
  );

  const [activeTab, setActiveTab] = useState("reading");
  const [fetchedBooks, setFetchedBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!user) return;

    const fetchUserBooks = async () => {
      setIsLoading(true);

      const allIds = [...new Set([...favorites, ...wantToRead, ...finished])];

      if (allIds.length === 0) {
        setFetchedBooks([]);
        setIsLoading(false);
        return;
      }

      // supabase filter
      const { data } = await supabase
        .from("tomes")
        .select("*")
        .in("id", allIds);

      if (data) setFetchedBooks(data);
      setIsLoading(false);
    };

    fetchUserBooks();
  }, [favorites, wantToRead, finished, user]);

  const getBooksForTab = () => {
    let targetIds = [];
    if (activeTab === "reading") targetIds = wantToRead;
    if (activeTab === "finished") targetIds = finished;
    if (activeTab === "favorites") targetIds = favorites;

    return fetchedBooks.filter((book) => targetIds.includes(book.id));
  };

  const currentBooks = getBooksForTab();

  // visitor
  if (!user) {
    return (
      <div className="guest-profile">
        <div
          style={{
            marginBottom: "1.5rem",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <div
            className="profile-avatar"
            style={{ width: 100, height: 100, fontSize: "3rem" }}
          >
            ?
          </div>
        </div>
        <h1>Who goes there?</h1>
        <p style={{ margin: "1rem 0 2rem 0", color: "var(--text-muted)" }}>
          This nook is reserved for registered wizards. Please log in to view
          your collection.
        </p>
        <Link to="/" className="btn-primary" style={{ display: "inline-flex" }}>
          Return to Entrance
        </Link>
      </div>
    );
  }

  return (
    <div className="profile-container">
      {/* header */}
      <div className="profile-header">
        <div className="profile-avatar">
          {user.email.charAt(0).toUpperCase()}
        </div>
        <div className="profile-info">
          <h1>Apprentice Wizard</h1>
          <p>{user.email}</p>

          <div className="profile-stats">
            <div className="stat-item">
              <span className="stat-value">{wantToRead.length}</span>
              <span className="stat-label">Reading</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{finished.length}</span>
              <span className="stat-label">Read</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{favorites.length}</span>
              <span className="stat-label">Adored</span>
            </div>
          </div>
        </div>
      </div>

      {/* tabs */}
      <div className="profile-tabs">
        <button
          className={`tab-btn ${activeTab === "reading" ? "active" : ""}`}
          onClick={() => setActiveTab("reading")}
        >
          Want to Read
        </button>
        <button
          className={`tab-btn ${activeTab === "finished" ? "active" : ""}`}
          onClick={() => setActiveTab("finished")}
        >
          Finished
        </button>
        <button
          className={`tab-btn ${activeTab === "favorites" ? "active" : ""}`}
          onClick={() => setActiveTab("favorites")}
        >
          Adored
        </button>
      </div>

      {/* content */}
      {isLoading ? (
        <div className="catalog-loading">Opening your satchel...</div>
      ) : (
        <>
          {currentBooks.length > 0 ? (
            <div className="book-grid">
              {currentBooks.map((book) => (
                <BookCard key={book.id} book={book} onGuestAction={() => {}} />
              ))}
            </div>
          ) : (
            <div className="empty-tab">
              <Sparkles
                size={48}
                style={{ marginBottom: "1rem", opacity: 0.5 }}
              />
              <h3>This shelf is dusty.</h3>
              <p>You haven't added any tomes to this list yet.</p>
              <Link
                to="/catalog"
                className="btn-primary"
                style={{ display: "inline-flex", marginTop: "1rem" }}
              >
                Browse the Catalog
              </Link>
            </div>
          )}
        </>
      )}
    </div>
  );
}
