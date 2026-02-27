import {
  Bird,
  Birdhouse,
  Feather,
  Flower,
  ScrollText,
  Send,
  Sparkle,
} from "lucide-react";
import "./ContactPage.css";
import { updateContactDraft } from "../store/uiSlice";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { supabase } from "../services/supabase";

export default function ContactPage() {
  const dispatch = useDispatch();
  const savedDraft = useSelector((state) => state.ui.contactDraft);

  const [status, setStatus] = useState("idle");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    tome: savedDraft || "",
    message: savedDraft || "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "message") {
      dispatch(updateContactDraft(value));
    }

    if (name === "tome") {
      dispatch(updateContactDraft(value));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("sending");

    try {
      const { error } = await supabase.from("pigeons").insert([
        {
          name: formData.name,
          email: formData.email,
          tome: formData.tome,
          message: formData.message,
        },
      ]);

      if (error) throw error;

      setStatus("success");
      setFormData({ name: "", email: "", tome: "", message: "" });
      dispatch(updateContactDraft(""));
    } catch (error) {
      console.error("Pigeon lost in transit:", error);
      setStatus("idle");
      alert("Oh no! The pigeon got lost. Please try again.");
    }
  };
  return (
    <div className="contact-wrp">
      <div className="card contact-card">
        <div className="contact-header">
          <div className="contact-icon-wrp">
            <Bird size={48} color="var(--btn-primary)" />
          </div>
          <h1 className="contact-title">Send a Pigeon</h1>
          <p className="contact-subtitle">
            Missing a treasured tale from our hollow, or dreaming of a grander
            treehouse? Dispatch a pigeon with your desires, and our librarians
            shall unfold your parchment the moment it flutters in.
          </p>
        </div>

        {status === "success" ? (
          <div className="success-message">
            <h3>Pigeon Released! </h3>
            <p>A Librarian will review your request shortly.</p>
            <button
              className="btn-primary"
              onClick={() => setStatus("idle")}
              style={{ marginTop: "1rem" }}
            >
              Send Another
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">
                <Flower size={20} color="pink" />
                Sprite Name
              </label>
              <input
                type="text"
                name="name"
                className="form-input"
                placeholder="e.g. Sparkle Leaf"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                <Birdhouse size={20} color="SaddleBrown" />
                Email
              </label>
              <input
                type="email"
                name="email"
                className="form-input"
                placeholder="sparkle@mushroom.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                <ScrollText size={20} color="DarkSalmon" />
                Tome Requested
              </label>
              <input
                type="text"
                name="tome"
                className="form-input"
                placeholder="Title and Author of the book"
                value={formData.tome}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                <Sparkle size={20} color="Goldenrod" />
                Additional Message
              </label>
              <textarea
                name="message"
                className="form-input"
                placeholder="I am curious about..."
                value={formData.message}
                onChange={handleChange}
              />
              <small className="draft-notice">
                {savedDraft ? "Draft saved..." : ""}
              </small>
            </div>

            <button
              type="submit"
              className="btn-primary"
              style={{ width: "100%", justifyContent: "center" }}
              disabled={status === "sending"}
            >
              {status === "sending" ? (
                <>
                  Sending... <Feather className="spin" size={20} />
                </>
              ) : (
                <>
                  Release Pigeon <Send size={20} />
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
