import {
  Bird,
  Birdhouse,
  Flower,
  ScrollText,
  Send,
  Sparkle,
} from "lucide-react";
import "./ContactPage.css";
export default function ContactPage() {
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
        <form>
          <div className="form-group">
            <label className="form-label">
              <Flower size={20} />
              Sprite Name
            </label>
            <input
              type="text"
              name="name"
              className="form-input"
              placeholder="e.g. Sparkle Leaf"
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              <Birdhouse size={20} />
              Email
            </label>
            <input
              type="email"
              name="email"
              className="form-input"
              placeholder="sparkle@mushroom.com"
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              <ScrollText size={20} />
              Tome Requested
            </label>
            <input
              type="text"
              name="tome"
              className="form-input"
              placeholder="Title and Author of the book"
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              <Sparkle size={20} />
              Additional Message
            </label>
            <textarea
              name="message"
              className="form-input"
              placeholder="I am curious about..."
            />
            <small className="draft-notice">Draft saved...</small>
          </div>

          <button
            type="submit"
            className="btn-primary"
            style={{ width: "100%", justifyContent: "center" }}
          >
            {" "}
            <Send /> Dispatch Pigeon
          </button>
        </form>
      </div>
    </div>
  );
}
