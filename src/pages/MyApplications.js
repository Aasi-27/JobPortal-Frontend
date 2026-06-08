import React, { useEffect, useState } from "react";
import { getMyApplications } from "../services/api";
import "./MyApplications.css";

const statusConfig = {
  PENDING: { color: "#f59e0b", bg: "#fffbeb", label: "⏳ Pending" },
  REVIEWED: { color: "#3b82f6", bg: "#eff6ff", label: "👀 Reviewed" },
  ACCEPTED: { color: "#10b981", bg: "#f0fdf4", label: "✅ Accepted" },
  REJECTED: { color: "#ef4444", bg: "#fef2f2", label: "❌ Rejected" },
};

const MyApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await getMyApplications();
        setApplications(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  return (
    <div className="myapps-page">
      <div className="myapps-hero">
        <div className="container">
          <h1>My Applications 📋</h1>
        </div>
      </div>
      <div className="container myapps-content">
        {loading ? (
          <p className="loading-text">Loading...</p>
        ) : applications.length === 0 ? (
          <div className="no-apps">
            <span>📭</span>
            <h3>No applications yet</h3>
            <p>Browse jobs and apply to get started!</p>
            <a href="/jobs" className="btn-browse">
              Browse Jobs →
            </a>
          </div>
        ) : (
          <div className="apps-list">
            {applications.map((app) => {
              const status = statusConfig[app.status] || statusConfig.PENDING;
              return (
                <div className="app-card" key={app.id}>
                  <div className="app-left">
                    <div className="app-company-avatar">
                      {app.job?.company?.charAt(0)}
                    </div>
                    <div className="app-info">
                      <h3>{app.job?.title}</h3>
                      <p className="app-company">
                        🏢 {app.job?.company} — 📍 {app.job?.location}
                      </p>
                      {app.applicantSkills && (
                        <p className="app-skills">🛠 {app.applicantSkills}</p>
                      )}
                      <p className="app-date">
                        Applied:{" "}
                        {new Date(app.appliedAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                  <span
                    className="app-status"
                    style={{ color: status.color, background: status.bg }}
                  >
                    {status.label}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyApplications;
