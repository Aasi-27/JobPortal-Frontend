import React, { useEffect, useState,useRef } from "react";
import {
  getAllJobs,
  createJob,
  deleteJob,
  updateJob,
  getApplicationsForJob,
  updateApplicationStatus,
} from "../services/api";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [selectedJobId, setSelectedJobId] = useState(null);
  const [selectedJobTitle, setSelectedJobTitle] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editJob, setEditJob] = useState(null);
  const [form, setForm] = useState({
    title: "",
    company: "",
    location: "",
    description: "",
    salary: "",
    jobType: "Full-time",
    experience: "Fresher",
    category: "IT",
  });
  const [msg, setMsg] = useState("");
  const [loadingApps, setLoadingApps] = useState(false);
  const [activeTab, setActiveTab] = useState("jobs");
  const formRef = useRef(null);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const res = await getAllJobs();
      setJobs(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleJobClick = async (job) => {
    if (selectedJobId === job.id) {
      setSelectedJobId(null);
      setApplications([]);
      setSelectedJobTitle("");
      return;
    }
    setSelectedJobId(job.id);
    setSelectedJobTitle(job.title);
    setLoadingApps(true);
    try {
      const res = await getApplicationsForJob(job.id);
      setApplications(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingApps(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editJob) {
        await updateJob(editJob.id, form);
        setMsg("✅ Job updated!");
      } else {
        await createJob(form);
        setMsg("✅ Job created!");
      }
      setShowForm(false);
      setEditJob(null);
      setForm({
        title: "",
        company: "",
        location: "",
        description: "",
        salary: "",
        jobType: "Full-time",
        experience: "Fresher",
        category: "IT",
      });
      fetchJobs();
      setTimeout(() => setMsg(""), 3000);
    } catch (err) {
      setMsg("❌ " + (err.response?.data || "Error"));
    }
  };

  const handleEdit = (job, e) => {
    e.stopPropagation();
    setEditJob(job);
    setForm({
      title: job.title,
      company: job.company,
      location: job.location,
      description: job.description || "",
      salary: job.salary || "",
      jobType: job.jobType || "Full-time",
      experience: job.experience || "Fresher",
      category: job.category || "IT",
    });
    setShowForm(true);
    setActiveTab("jobs");

  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (window.confirm("Delete this job?")) {
      await deleteJob(id);
      fetchJobs();
      if (selectedJobId === id) {
        setSelectedJobId(null);
        setApplications([]);
      }
    }
  };

  const handleStatusChange = async (appId, status) => {
    await updateApplicationStatus(appId, status);
    const res = await getApplicationsForJob(selectedJobId);
    setApplications(res.data);
  };

  const statusConfig = {
    PENDING: { color: "#f59e0b", bg: "#fffbeb", label: "⏳ Pending" },
    REVIEWED: { color: "#3b82f6", bg: "#eff6ff", label: "👀 Reviewed" },
    ACCEPTED: { color: "#10b981", bg: "#f0fdf4", label: "✅ Accepted" },
    REJECTED: { color: "#ef4444", bg: "#fef2f2", label: "❌ Rejected" },
  };

  return (
    <div className="admin-page">
      <div className="admin-hero">
        <div className="container admin-hero-inner">
          <div>
            <h1>Admin Dashboard 🛠️</h1>
            <p>Total Jobs: {jobs.length} jobs </p>
          </div>
          <button
            className="btn-add"
            onClick={() => {
              setShowForm(!showForm);
              setEditJob(null);
              setForm({
                title: "",
                company: "",
                location: "",
                description: "",
                salary: "",
                jobType: "Full-time",
                experience: "Fresher",
                category: "IT",
              });
            }}
          >
            {showForm ? "✕ Cancel" : "+ Add Job"}
          </button>
        </div>
      </div>

      <div className="container admin-content">
        {msg && (
          <div
            className={`admin-msg ${msg.includes("✅") ? "success" : "error"}`}
          >
            {msg}
          </div>
        )}

        {/* Add/Edit Form */}
        {showForm && (
          <div className="job-form-card">
            <h3>{editJob ? "✏️ Edit Job" : "➕ Add New Job"}</h3>
            <form onSubmit={handleSubmit} className="job-form">
              <div className="form-row">
                <div className="fg">
                  <label>Job Title *</label>
                  <input
                    placeholder="Enter job title"
                    value={form.title}
                    onChange={(e) =>
                      setForm({ ...form, title: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="fg">
                  <label>Company *</label>
                  <input
                    placeholder="Enter company name"
                    value={form.company}
                    onChange={(e) =>
                      setForm({ ...form, company: e.target.value })
                    }
                    required
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="fg">
                  <label>Location *</label>
                  <input
                    placeholder="Enter Location"
                    value={form.location}
                    onChange={(e) =>
                      setForm({ ...form, location: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="fg">
                  <label>Salary</label>
                  <input
                    placeholder="Enter salary"
                    value={form.salary}
                    onChange={(e) =>
                      setForm({ ...form, salary: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="fg">
                  <label>Job Type</label>
                  <select
                    value={form.jobType}
                    onChange={(e) =>
                      setForm({ ...form, jobType: e.target.value })
                    }
                  >
                    <option>Full-time</option>
                    <option>Part-time</option>
                    <option>Internship</option>
                    <option>Remote</option>
                  </select>
                </div>
                <div className="fg">
                  <label>Experience</label>
                  <select
                    value={form.experience}
                    onChange={(e) =>
                      setForm({ ...form, experience: e.target.value })
                    }
                  >
                    <option>Fresher</option>
                    <option>0-1 years</option>
                    <option>1-2 years</option>
                    <option>2-3 years</option>
                    <option>3+ years</option>
                  </select>
                </div>
              </div>
              <div className="fg full">
                <label>Description *</label>
                <textarea
                  rows={3}
                  placeholder="Job description..."
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  required
                />
              </div>
              <button type="submit" className="btn-form-submit">
                {editJob ? "Update Job" : "Create Job"}
              </button>
            </form>
          </div>
        )}

        {/* Jobs List */}
        <div className="jobs-list">
          {jobs.map((job) => (
            <div key={job.id}>
              {/* Job Row — clickable */}
              <div
                className={`admin-job-row ${selectedJobId === job.id ? "job-row-active" : ""}`}
                onClick={() => handleJobClick(job)}
              >
                <div className="job-avatar">{job.company?.charAt(0)}</div>
                <div className="admin-job-info">
                  <h4>{job.title}</h4>
                  <p>
                    {job.company} — {job.location}{" "}
                    {job.salary ? `— ${job.salary}` : ""}
                  </p>
                </div>
                <div className="job-row-right">
                  <span className="app-count-badge">
                    👥 {selectedJobId === job.id ? applications.length : "?"}{" "}
                    applicants
                  </span>
                  <button
                    className="btn-edit"
                    onClick={(e) => handleEdit(job, e)}
                  >
                    ✏️
                  </button>
                  <button
                    className="btn-del"
                    onClick={(e) => handleDelete(job.id, e)}
                  >
                    🗑️
                  </button>
                  <span className="expand-icon">
                    {selectedJobId === job.id ? "▲" : "▼"}
                  </span>
                </div>
              </div>

              {/* Applicants — expand inline */}
              {selectedJobId === job.id && (
                <div className="applicants-panel">
                  <div className="applicants-header">
                    <h3>
                      📋 Applicants for <span>{selectedJobTitle}</span>
                    </h3>
                    <span className="total-badge">
                      {applications.length} total
                    </span>
                  </div>

                  {loadingApps ? (
                    <div className="apps-loading">Loading applicants...</div>
                  ) : applications.length === 0 ? (
                    <div className="no-apps-msg">
                      <span>📭</span>
                      <p>No applications yet for this job.</p>
                    </div>
                  ) : (
                    <div className="applicants-grid">
                      {applications.map((app) => {
                        const status =
                          statusConfig[app.status] || statusConfig.PENDING;
                        return (
                          <div className="applicant-card" key={app.id}>
                            {/* Applicant Header */}
                            <div className="applicant-header">
                              <div className="applicant-avatar">
                                {app.user?.name?.charAt(0)}
                              </div>
                              <div className="applicant-name-info">
                                <h4>{app.user?.name}</h4>
                                <p>📧 {app.user?.email}</p>
                              </div>
                              <select
                                className="status-select-inline"
                                value={app.status}
                                style={{
                                  color: status.color,
                                  borderColor: status.color,
                                  background: status.bg,
                                }}
                                onChange={(e) =>
                                  handleStatusChange(app.id, e.target.value)
                                }
                              >
                                <option value="PENDING">⏳ PENDING</option>
                                <option value="REVIEWED">👀 REVIEWED</option>
                                <option value="ACCEPTED">✅ ACCEPTED</option>
                                <option value="REJECTED">❌ REJECTED</option>
                              </select>
                            </div>

                            {/* Applicant Details */}
                            <div className="applicant-details">
                              {app.applicantPhone && (
                                <div className="detail-row">
                                  <span className="detail-label">📞 Phone</span>
                                  <span className="detail-value">
                                    {app.applicantPhone}
                                  </span>
                                </div>
                              )}
                              {app.applicantExperience && (
                                <div className="detail-row">
                                  <span className="detail-label">
                                    ⭐ Experience
                                  </span>
                                  <span className="detail-value">
                                    {app.applicantExperience}
                                  </span>
                                </div>
                              )}
                              {app.applicantSkills && (
                                <div className="detail-row">
                                  <span className="detail-label">
                                    🛠 Skills
                                  </span>
                                  <div className="skills-chips">
                                    {app.applicantSkills.split(",").map((s) => (
                                      <span
                                        key={s.trim()}
                                        className="skill-chip"
                                      >
                                        {s.trim()}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              )}
                              {app.coverLetter && (
                                <div className="detail-row cover-row">
                                  <span className="detail-label">
                                    💬 Cover Letter
                                  </span>
                                  <p className="cover-letter-text">
                                    {app.coverLetter}
                                  </p>
                                </div>
                              )}
                              <div className="detail-row">
                                <span className="detail-label">📅 Applied</span>
                                <span className="detail-value">
                                  {new Date(app.appliedAt).toLocaleDateString(
                                    "en-IN",
                                    {
                                      day: "numeric",
                                      month: "short",
                                      year: "numeric",
                                    },
                                  )}
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
