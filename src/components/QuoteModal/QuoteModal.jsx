import { useState, useEffect } from "react";
import { X, Sparkles } from "lucide-react";
import "./QuoteModal.css";

export default function QuoteModal({ onClose }) {
  const [quoteData, setQuoteData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // flag to track this component
    let ignore = false;
    const apiKey = import.meta.env.VITE_QUOTE_API_KEY;

    const fetchQuote = async () => {
      setTimeout(() => {
        //run the fetch if we haven't unmounted yet
        if (ignore) return;

        fetch("https://api.api-ninjas.com/v2/randomquotes", {
          headers: {
            "X-Api-Key": apiKey,
          },
        })
          .then((res) => res.json())
          .then((data) => {
            if (!ignore && data.length > 0) {
              setQuoteData({
                text: data[0].quote,
                author: data[0].author,
                from: data[0].work,
              });
              setIsLoading(false);
            }
          })
          .catch(() => {
            if (!ignore) {
              setQuoteData({
                text: "The stars are cloudy today. Try again later.",
                author: "Head Librarian",
              });
              setIsLoading(false);
            }
          });
      }, 1500);
    };

    fetchQuote();

    //runs when the component unmounts
    return () => {
      ignore = true;
    };
  }, []);

  return (
    <div className="behind-quote-modal">
      <div className="quote-modal">
        <button className="icon-btn" id="quote-close-btn" onClick={onClose}>
          <X size={20} />
        </button>

        <Sparkles
          size={32}
          style={{ marginBottom: "1rem", color: "#ecc94b" }}
        />

        {isLoading ? (
          <h3 style={{ fontStyle: "italic", animation: "pulse 1.5s infinite" }}>
            Reading through stars...
          </h3>
        ) : (
          quoteData && (
            <>
              <h3 className="quote-text">"{quoteData.text}"</h3>
              <p style={{ fontWeight: "bold", margin: 0 }}>
                — {quoteData.author}
                {quoteData.from && <span>, {quoteData.from}</span>}
              </p>
            </>
          )
        )}
      </div>
    </div>
  );
}
