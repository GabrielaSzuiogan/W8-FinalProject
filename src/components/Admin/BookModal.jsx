import { useState } from "react";
import { supabase } from "../../services/supabase";
import { X, Loader } from "lucide-react";

export default function BookModal({ bookToEdit, onClose }) {
  const [formData, setFormData] = useState(
    bookToEdit || {
      title: "",
      author: "",
      category: "Fantasy",
      description: "",
      sparkleRating: 5,
      coverUrl: "",
    },
  );
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let url = formData.coverUrl;
      // Image Upload Logic (Same as before)
      if (imageFile) {
        const fileName = `${Date.now()}.${imageFile.name.split(".").pop()}`;
        await supabase.storage.from("book-covers").upload(fileName, imageFile);
        const { data } = supabase.storage
          .from("book-covers")
          .getPublicUrl(fileName);
        url = data.publicUrl;
      }

      const dataToSave = { ...formData, coverUrl: url };

      if (bookToEdit) {
        await supabase.from("tomes").update(dataToSave).eq("id", bookToEdit.id);
      } else {
        await supabase.from("tomes").insert([dataToSave]);
      }
      onClose();
    } catch (error) {
      alert("Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "1rem",
          }}
        >
          <h2>{bookToEdit ? "Edit Tome" : "New Tome"}</h2>
          <button
            onClick={onClose}
            style={{ background: "none", border: "none", cursor: "pointer" }}
          >
            <X />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "grid", gap: "1rem" }}>
          <input
            className="search-input"
            placeholder="Title"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            required
          />
          <input
            className="search-input"
            placeholder="Author"
            value={formData.author}
            onChange={(e) =>
              setFormData({ ...formData, author: e.target.value })
            }
            required
          />

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "1rem",
            }}
          >
            <select
              className="search-input"
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
            >
              <option>Fantasy</option>
              <option>Sci-Fi</option>
              <option>Mystery</option>
            </select>
            <input
              type="number"
              className="search-input"
              min="1"
              max="5"
              value={formData.sparkleRating}
              onChange={(e) =>
                setFormData({ ...formData, sparkleRating: e.target.value })
              }
            />
          </div>

          <input
            type="file"
            onChange={(e) => setImageFile(e.target.files[0])}
          />
          <textarea
            className="search-input"
            rows="3"
            placeholder="Description"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
          />

          <button
            type="submit"
            className="btn-add"
            style={{ justifyContent: "center", marginTop: "1rem" }}
            disabled={loading}
          >
            {loading ? <Loader className="spin" /> : "Save Book"}
          </button>
        </form>
      </div>
    </div>
  );
}
