import { useState, useEffect } from "react";
import { supabase } from "../../services/supabase";
import { Check, Trash2, Mail, MailOpen } from "lucide-react";
import "./ManagePigeons.css";

export default function ManagePigeons() {
  const [pigeons, setPigeons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    const fetchPigeons = async () => {
      const { data, error } = await supabase
        .from("pigeons")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && data) {
        setPigeons(data);
      }
      setLoading(false);
    };

    fetchPigeons();
  }, [refreshTrigger]);

  const handleMarkDone = async (id, currentStatus) => {
    const newStatus = currentStatus === "pending" ? "done" : "pending";
    await supabase.from("pigeons").update({ status: newStatus }).eq("id", id);
    setRefreshTrigger((prev) => prev + 1);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this message?"))
      return;
    await supabase.from("pigeons").delete().eq("id", id);
    setRefreshTrigger((prev) => prev + 1);
  };

  if (loading) return <div>Checking the pigeon coop...</div>;

  return (
    <div className="pigeon-list">
      {pigeons.length === 0 ? (
        <p style={{ color: "var(--text-muted)" }}>
          No new pigeons have arrived.
        </p>
      ) : (
        pigeons.map((pigeon) => (
          <div className={`pigeon-card ${pigeon.status}`} key={pigeon.id}>
            <div className="pigeon-icon-wrapper">
              {pigeon.status === "pending" ? (
                <Mail size={32} color="var(--btn-primary)" />
              ) : (
                <MailOpen size={32} color="var(--text-muted)" />
              )}
            </div>

            <div className="pigeon-content">
              <h4 className="pigeon-title">
                {pigeon.name} requested: <span>{pigeon.tome}</span>
              </h4>
              <p className="pigeon-email">{pigeon.email}</p>

              {pigeon.message && (
                <div className="pigeon-message-box">"{pigeon.message}"</div>
              )}

              <div className="pigeon-meta">
                <span>
                  Received: {new Date(pigeon.created_at).toLocaleDateString()}
                </span>
                <span className={`badge ${pigeon.status}`}>
                  {pigeon.status.toUpperCase()}
                </span>
              </div>
            </div>

            <div className="pigeon-actions">
              <button
                className="action-btn btn-edit"
                onClick={() => handleMarkDone(pigeon.id, pigeon.status)}
                title={
                  pigeon.status === "pending"
                    ? "Mark as Done"
                    : "Mark as Pending"
                }
              >
                <Check size={20} />
              </button>
              <button
                className="action-btn btn-delete"
                onClick={() => handleDelete(pigeon.id)}
                title="Delete Message"
              >
                <Trash2 size={20} />
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
