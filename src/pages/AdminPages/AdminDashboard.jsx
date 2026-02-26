import ManageBooks from "../../components/Admin/ManageBooks";

import "./AdminDashboard.css";

export default function AdminDashboard() {
  return (
    <div className="admin-container">
      <div className="admin-header">
        <h2>Grand Maester</h2>
        <p style={{ color: "var(--text-muted)", marginTop: "0.5rem" }}>
          Manage the archives, summon new tomes, and organize the collection.
        </p>
      </div>

      <div className="tab-content">
        <ManageBooks />
      </div>
    </div>
  );
}
