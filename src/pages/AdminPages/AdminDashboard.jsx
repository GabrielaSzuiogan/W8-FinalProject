import { useState } from "react";
import ManageBooks from "../../components/Admin/ManageBooks";
import ManagePigeons from "../../components/Admin/ManagePigeons";

import "./AdminDashboard.css";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("books");

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h2>Grand Maester</h2>
        <p style={{ color: "var(--text-muted)", marginTop: "0.5rem" }}>
          Manage the archives, summon new tomes, and review pigeon requests.
        </p>
      </div>

      <div className="admin-tabs">
        <button
          className={`tab-btn ${activeTab === "books" ? "active" : ""}`}
          onClick={() => setActiveTab("books")}
        >
          Library Archives
        </button>
        <button
          className={`tab-btn ${activeTab === "pigeons" ? "active" : ""}`}
          onClick={() => setActiveTab("pigeons")}
        >
          Pigeon Messages
        </button>
      </div>

      <div className="tab-content">
        {activeTab === "books" ? <ManageBooks /> : <ManagePigeons />}
      </div>
    </div>
  );
}
