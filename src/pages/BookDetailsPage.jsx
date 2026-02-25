import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../services/supabase";
import { ArrowLeft } from "lucide-react";
import AuthGateModal from "../components/AuthGateModal/AuthGateModal";
import BookCard from "../components/BookCard/BookCard";
import MobileBookControls from "../components/BookDetails/MobileBookCtrl";
import DesktopBookControls from "../components/BookDetails/DesktopBookCtrl";
import "./BookDetailsPage.css";

export default function BookDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [book, setBook] = useState(null);
  const [relatedCategory, setRelatedCategory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAuthModal, setShowAuthModal] = useState(false);

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

  if (isLoading)
    return <div className="catalog-loading">Summoning details...</div>;
  if (!book) return <div className="catalog-error">Tome not found.</div>;

  return (
    <div className="details-page-wrapper">
      {/* header only on mobile */}
      <div className="details-mobile-header">
        <button onClick={() => navigate("/catalog")} className="icon-btn">
          <ArrowLeft size={22} />
        </button>
      </div>

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

        {/* right: details */}
        <div className="details-main-info">
          <h1 className="details-title">{book.title}</h1>
          <p className="details-author">by {book.author}</p>

          <DesktopBookControls
            book={book}
            onGuestAction={() => setShowAuthModal(true)}
          />

          <MobileBookControls
            book={book}
            onGuestAction={() => setShowAuthModal(true)}
          />

          <div className="details-synopsis">
            <h3 className="section-label-center">Description</h3>
            <p className="description-text">{book.description}</p>
          </div>
        </div>
      </div>

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
