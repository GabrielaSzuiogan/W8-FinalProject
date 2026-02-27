import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchTomes } from "../store/librarySlice";
import { Search, Loader, BookOpen } from "lucide-react";

import BookCard from "../components/BookCard/BookCard.jsx";
import AuthGateModal from "../components/AuthGateModal/AuthGateModal.jsx";
import "./CatalogPage.css";
import { useNavigate } from "react-router-dom";

export default function CatalogPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { tomes, isLoading, error } = useSelector((state) => state.library);

  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [showAuthModal, setShowAuthModal] = useState(false);

  const [displayCount, setDisplayCount] = useState(25);

  useEffect(() => {
    dispatch(fetchTomes());
  }, [dispatch]);

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop + 100 >=
        document.documentElement.offsetHeight
      ) {
        setDisplayCount((prevCount) => prevCount + 25);
      }
    };
    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const categories = [
    "All",
    ...new Set(tomes.map((t) => t.category).filter(Boolean)),
  ].sort();

  const filteredTomes = tomes.filter((tome) => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch =
      (tome.title && tome.title.toLowerCase().includes(searchLower)) ||
      (tome.author && tome.author.toLowerCase().includes(searchLower)) ||
      (tome.description &&
        tome.description.toLowerCase().includes(searchLower));

    const matchesCategory =
      categoryFilter === "All" || tome.category === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  const visibleTomes = filteredTomes.slice(0, displayCount);

  return (
    <div className="catalog-container">
      <div className="catalog-header">
        <h1>The Grand Catalog</h1>
        <p>Browse the ancient collection of the Starwood.</p>
      </div>

      <div className="catalog-controls">
        <div className="catalog-search-wrapper">
          <Search size={20} className="search-icon" />
          <input
            id="catalog-search"
            name="catalogSearch"
            type="text"
            placeholder="Search titles, authors, or descriptions..."
            className="catalog-search-input"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setDisplayCount(25);
            }}
          />
        </div>

        <select
          className="catalog-filter-select"
          id="catalog-filter"
          name="catalogFilter"
          value={categoryFilter}
          onChange={(e) => {
            setCategoryFilter(e.target.value);
            setDisplayCount(25);
          }}
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat === "All" ? "All Categories" : cat}
            </option>
          ))}
        </select>
      </div>

      {isLoading && (
        <div className="catalog-loading">
          <Loader className="spin" size={48} color="var(--btn-primary)" />
          <p>Summoning tomes...</p>
        </div>
      )}

      {error && (
        <div className="catalog-error">
          <p>The library is closed temporarily: {error}</p>
        </div>
      )}

      {!isLoading && !error && (
        <>
          {filteredTomes.length === 0 ? (
            <div className="catalog-empty">
              <BookOpen size={48} />
              <h3>No tomes found.</h3>
              <p>Try searching for a different spell or potion.</p>
            </div>
          ) : (
            <>
              <div className="book-grid">
                {visibleTomes.map((tome) => (
                  <BookCard
                    key={tome.id}
                    book={tome}
                    onGuestAction={() => setShowAuthModal(true)}
                  />
                ))}
              </div>

              {visibleTomes.length < filteredTomes.length && (
                <div
                  style={{ textAlign: "center", padding: "2rem", opacity: 0.6 }}
                >
                  <p>Reading more stars...</p>
                </div>
              )}
            </>
          )}
        </>
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
