import React, { useEffect, useState } from "react";
import { getAllJobs, searchJobs } from "../services/api";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Jobs.css";

const COMPANY_COLORS = {
  default: ["#006699", "#0099CC"],
};

const getCompanyColors = (company) => {
  for (const key of Object.keys(COMPANY_COLORS)) {
    if (company?.toLowerCase().includes(key.toLowerCase()))
      return COMPANY_COLORS[key];
  }
  return COMPANY_COLORS["default"];
};

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const res = await getAllJobs();
      setJobs(res.data);
    } catch (err) {
      console.error("Jobs fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!search.trim()) {
      fetchJobs();
      return;
    }
    try {
      const res = await searchJobs(search);
      setJobs(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const jobTypeColor = {
    "Full-time": { bg: "#dcfce7", color: "#16a34a" },
    Internship: { bg: "#fef9c3", color: "#ca8a04" },
    "Part-time": { bg: "#dbeafe", color: "#1d4ed8" },
    Remote: { bg: "#f3e8ff", color: "#9333ea" },
  };

  return (
    <div className="jobs-page">
      <div className="jobs-hero">
        <div className="container">
          <h1>
            Browse <span className="text-accent">All Jobs</span>
          </h1>
          <form className="search-bar" onSubmit={handleSearch}>
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search by job title..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button type="submit" className="btn-search">
              Search
            </button>
            {search && (
              <button
                type="button"
                className="btn-clear"
                onClick={() => {
                  setSearch("");
                  fetchJobs();
                }}
              >
                ✕
              </button>
            )}
          </form>
        </div>
      </div>

      <div className="container jobs-content">
        <div className="jobs-count">{jobs.length} jobs found</div>

        {loading ? (
          <div className="loading-grid">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="job-skeleton"></div>
            ))}
          </div>
        ) : jobs.length === 0 ? (
          <div className="no-jobs">
            <span>😕</span>
            <p>No jobs found. Try a different search.</p>
          </div>
        ) : (
          <div className="jobs-grid">
            {jobs.map((job) => {
              const colors = getCompanyColors(job.company);
              const typeStyle = jobTypeColor[job.jobType] || {
                bg: "#f3e8ff",
                color: "#006699",
              };
              return (
                <div
                  className="job-card"
                  key={job.id}
                  onClick={() => navigate(`/jobs/${job.id}`)}
                  style={{ cursor: "pointer" }}
                >
                  {/* Company Banner */}
                  <div
                    className="job-banner"
                    style={{
                      background: `linear-gradient(135deg, ${colors[0]}, ${colors[1]})`,
                    }}
                  >
                    <div className="company-logo">
                      {job.company?.charAt(0).toUpperCase()}
                    </div>
                    <div className="banner-info">
                      <span className="banner-company">{job.company}</span>
                      <span className="banner-location">📍 {job.location}</span>
                    </div>
                    <span
                      className="job-type-badge"
                      style={{
                        background: "rgba(255,255,255,0.25)",
                        color: "white",
                      }}
                    >
                      {job.jobType || "Full-time"}
                    </span>
                  </div>

                  {/* Card Body */}
                  <div className="job-body">
                    <h3 className="job-title">{job.title}</h3>
                    <div className="job-tags">
                      {job.experience && (
                        <span className="job-tag">⭐ {job.experience}</span>
                      )}
                      {job.category && (
                        <span className="job-tag">💼 {job.category}</span>
                      )}
                    </div>
                    {job.salary && (
                      <div className="job-salary">💰 {job.salary}</div>
                    )}
                    <p className="job-desc">
                      {job.description?.substring(0, 90)}...
                    </p>
                    <div className="job-card-footer">
                      <span className="view-details-hint">
                        👆 Click to view full details & apply
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Jobs;
