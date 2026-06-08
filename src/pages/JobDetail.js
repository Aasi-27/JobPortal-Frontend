import ReactMarkdown from "react-markdown";
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getJobById, applyForJob } from "../services/api";
import { useAuth } from "../context/AuthContext";
import "./JobDetail.css";

const SKILL_SUGGESTIONS = [
  "Java",
  "Spring Boot",
  "React JS",
  "MySQL",
  "REST APIs",
  "JWT",
  "Hibernate",
  "JPA",
  "HTML5",
  "CSS3",
  "JavaScript",
  "Git",
  "GitHub",
  "Postman",
  "Maven",
  "Microservices",
  "Docker",
  "AWS",
  "Python",
  "Node.js",
  "MongoDB",
  "TypeScript",
  "Redux",
];

const LOCATION_SUGGESTIONS = [
  "Chennai, Tamil Nadu",
  "Bangalore, Karnataka",
  "Hyderabad, Telangana",
  "Mumbai, Maharashtra",
  "Pune, Maharashtra",
  "Delhi, NCR",
  "Noida, Uttar Pradesh",
  "Coimbatore, Tamil Nadu",
  "Madurai, Tamil Nadu",
];

const EXPERIENCE_OPTIONS = [
  "Fresher",
  "0-1 years",
  "1-2 years",
  "2-3 years",
  "3+ years",
];

const COMPANY_COLORS = {
  default: ["#006699", "#0099CC"],
};

const getColors = (company) => {
  for (const key of Object.keys(COMPANY_COLORS)) {
    if (company?.toLowerCase().includes(key.toLowerCase()))
      return COMPANY_COLORS[key];
  }
  return COMPANY_COLORS["default"];
};

const JobDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [applyForm, setApplyForm] = useState({
    phone: "+91",
    experience: "",
    skills: [],
    coverLetter: "",
    location: "",
  });
  const [skillInput, setSkillInput] = useState("");
  const [showSkillSug, setShowSkillSug] = useState(false);
  const [showLocSug, setShowLocSug] = useState(false);
  const [errors, setErrors] = useState({});
  const [applying, setApplying] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await getJobById(id);
        setJob(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id]);

  const validatePhone = (phone) =>
    /^\+91[6-9]\d{9}$/.test(phone.replace(/\s/g, ""));

  const handlePhoneChange = (value) => {
    if (!value.startsWith("+91")) value = "+91";
    const digits = value.slice(3).replace(/\D/g, "").slice(0, 10);
    setApplyForm({ ...applyForm, phone: "+91" + digits });
  };

  const addSkill = (skill) => {
    if (!applyForm.skills.includes(skill) && applyForm.skills.length < 10) {
      setApplyForm({ ...applyForm, skills: [...applyForm.skills, skill] });
    }
    setSkillInput("");
    setShowSkillSug(false);
  };

  const removeSkill = (skill) =>
    setApplyForm({
      ...applyForm,
      skills: applyForm.skills.filter((s) => s !== skill),
    });

  const filteredSkills = SKILL_SUGGESTIONS.filter(
    (s) =>
      s.toLowerCase().includes(skillInput.toLowerCase()) &&
      !applyForm.skills.includes(s),
  );
  const filteredLocs = LOCATION_SUGGESTIONS.filter((l) =>
    l.toLowerCase().includes(applyForm.location.toLowerCase()),
  );

  const validate = () => {
    const e = {};
    if (!validatePhone(applyForm.phone))
      e.phone = "Valid mobile number required";
    if (!applyForm.experience) e.experience = "Select your experience";
    if (applyForm.skills.length === 0) e.skills = "Add at least one skill";
    if (!applyForm.location.trim()) e.location = "Location required";
    if (applyForm.coverLetter.trim().length < 30)
      e.coverLetter = "Min 30 characters required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const isFormValid = () =>
    validatePhone(applyForm.phone) &&
    applyForm.experience &&
    applyForm.skills.length > 0 &&
    applyForm.location.trim() &&
    applyForm.coverLetter.trim().length >= 30;

  const handleApply = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setApplying(true);
    try {
      await applyForJob(job.id, {
        phone: applyForm.phone,
        experience: applyForm.experience,
        skills: applyForm.skills.join(", "),
        coverLetter: applyForm.coverLetter,
        resumeLink: applyForm.location,
      });
      setSuccessMsg("✅ Application submitted successfully!");
      setShowModal(false);
      setApplyForm({
        phone: "+91",
        experience: "",
        skills: [],
        coverLetter: "",
        location: "",
      });
    } catch (err) {
      setSuccessMsg("❌ " + (err.response?.data || "Already applied."));
    } finally {
      setApplying(false);
    }
  };

  if (loading)
    return (
      <div className="jd-loading">
        <div className="spinner"></div>
        <p>Loading job details...</p>
      </div>
    );
  if (!job)
    return (
      <div className="jd-loading">
        <p>Job not found.</p>
      </div>
    );

  const colors = getColors(job.company);

  return (
    <div className="jd-page">
      {/* Hero Banner */}
      <div
        className="jd-banner"
        style={{
          background: `linear-gradient(135deg, ${colors[0]}, ${colors[1]})`,
        }}
      >
        <div className="container jd-banner-inner">
          <button className="btn-back" onClick={() => navigate("/jobs")}>
            ← Back to Jobs
          </button>
          <div className="jd-company-row">
            <div className="jd-company-logo">{job.company?.charAt(0)}</div>
            <div>
              <h1 className="jd-title">{job.title}</h1>
              <p className="jd-company">{job.company}</p>
            </div>
          </div>
          <div className="jd-meta-row">
            {job.location && (
              <span className="jd-meta-chip">📍 {job.location}</span>
            )}
            {job.jobType && (
              <span className="jd-meta-chip">💼 {job.jobType}</span>
            )}
            {job.experience && (
              <span className="jd-meta-chip">⭐ {job.experience}</span>
            )}
            {job.salary && (
              <span className="jd-meta-chip salary-chip">💰 {job.salary}</span>
            )}
            {job.category && (
              <span className="jd-meta-chip">🏷️ {job.category}</span>
            )}
          </div>
        </div>
      </div>

      <div className="container jd-content">
        <div className="jd-layout">
          {/* Left - Full JD */}
          <div className="jd-main">
            <div className="jd-card">
              <h2>Job Description</h2>
              <div className="jd-description">
                <ReactMarkdown>{job.description}</ReactMarkdown>
              </div>
            </div>

            <div className="jd-card">
              <h2>Requirements</h2>
              <ul className="jd-requirements">
                <li>
                  Strong knowledge in {job.category || "relevant technologies"}
                </li>
                <li>
                  Experience: {job.experience || "As per role requirements"}
                </li>
                <li>Good communication and problem-solving skills</li>
                <li>Ability to work in a team environment</li>
                <li>Willingness to learn and adapt to new technologies</li>
              </ul>
            </div>

            <div className="jd-card">
              <h2>What We Offer</h2>
              <ul className="jd-offers">
                <li>
                  💰 Competitive salary:{" "}
                  {job.salary || "As per industry standards"}
                </li>
                <li>🏥 Health insurance coverage</li>
                <li>📈 Career growth opportunities</li>
                <li>🎓 Learning & development programs</li>
                <li>🏖️ Paid time off and holidays</li>
              </ul>
            </div>
          </div>

          {/* Right - Apply Card */}
          <div className="jd-sidebar">
            <div className="apply-card">
              <div
                className="apply-card-header"
                style={{
                  background: `linear-gradient(135deg, ${colors[0]}, ${colors[1]})`,
                }}
              >
                <div className="apply-logo">{job.company?.charAt(0)}</div>
                <div>
                  <h3>{job.company}</h3>
                  <p>📍 {job.location}</p>
                </div>
              </div>
              <div className="apply-card-body">
                <div className="apply-detail">
                  <span>💼 Job Type</span>
                  <strong>{job.jobType || "Full-time"}</strong>
                </div>
                <div className="apply-detail">
                  <span>⭐ Experience</span>
                  <strong>{job.experience || "Not specified"}</strong>
                </div>
                <div className="apply-detail">
                  <span>💰 Salary</span>
                  <strong>{job.salary || "As per standards"}</strong>
                </div>
                <div className="apply-detail">
                  <span>🏷️ Category</span>
                  <strong>{job.category || "IT"}</strong>
                </div>

                {successMsg && (
                  <div
                    className={`apply-success ${successMsg.includes("✅") ? "success" : "error"}`}
                  >
                    {successMsg}
                  </div>
                )}

                {user && user.role === "USER" ? (
                  <button
                    className="btn-apply-now"
                    style={{
                      background: `linear-gradient(135deg, ${colors[0]}, ${colors[1]})`,
                    }}
                    onClick={() => setShowModal(true)}
                  >
                    Apply Now →
                  </button>
                ) : !user ? (
                  <button
                    className="btn-apply-now"
                    style={{
                      background: `linear-gradient(135deg, ${colors[0]}, ${colors[1]})`,
                    }}
                    onClick={() => navigate("/login")}
                  >
                    Login to Apply →
                  </button>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Apply Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="apply-modal" onClick={(e) => e.stopPropagation()}>
            <div
              className="modal-top"
              style={{
                background: `linear-gradient(135deg, ${colors[0]}, ${colors[1]})`,
              }}
            >
              <div className="modal-logo">{job.company?.charAt(0)}</div>
              <div>
                <h3>{job.title}</h3>
                <p>
                  {job.company} — {job.location}
                </p>
              </div>
              <button className="modal-x" onClick={() => setShowModal(false)}>
                ✕
              </button>
            </div>

            <form onSubmit={handleApply} className="modal-form">
              {/* Phone */}
              <div className="mf-group">
                <label>Phone Number *</label>
                <div
                  className={`phone-wrap ${errors.phone ? "err-border" : ""}`}
                >
                  <span className="pflag">🇮🇳 +91</span>
                  <input
                    type="tel"
                    placeholder="9876543210"
                    value={applyForm.phone.slice(3)}
                    onChange={(e) => handlePhoneChange("+91" + e.target.value)}
                    maxLength={10}
                  />
                  {applyForm.phone.length === 13 &&
                    validatePhone(applyForm.phone) && <span>✅</span>}
                </div>
                {errors.phone && (
                  <span className="err-txt">⚠️ {errors.phone}</span>
                )}
              </div>

              {/* Experience */}
              <div className="mf-group">
                <label>Experience *</label>
                <div className="exp-row">
                  {EXPERIENCE_OPTIONS.map((exp) => (
                    <button
                      type="button"
                      key={exp}
                      className={`exp-chip ${applyForm.experience === exp ? "exp-selected" : ""}`}
                      onClick={() =>
                        setApplyForm({ ...applyForm, experience: exp })
                      }
                    >
                      {exp}
                    </button>
                  ))}
                </div>
                {errors.experience && (
                  <span className="err-txt">⚠️ {errors.experience}</span>
                )}
              </div>

              {/* Skills */}
              <div className="mf-group" style={{ position: "relative" }}>
                <label>Skills *</label>
                <div
                  className={`skills-box ${errors.skills ? "err-border" : ""}`}
                >
                  {applyForm.skills.map((s) => (
                    <span key={s} className="skill-chip">
                      {s}{" "}
                      <button type="button" onClick={() => removeSkill(s)}>
                        ✕
                      </button>
                    </span>
                  ))}
                  {applyForm.skills.length < 10 && (
                    <input
                      type="text"
                      className="skill-inp"
                      placeholder="Type skill..."
                      value={skillInput}
                      onChange={(e) => {
                        setSkillInput(e.target.value);
                        setShowSkillSug(true);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && skillInput.trim()) {
                          e.preventDefault();
                          addSkill(skillInput.trim());
                        }
                      }}
                      onFocus={() => setShowSkillSug(true)}
                      onBlur={() =>
                        setTimeout(() => setShowSkillSug(false), 200)
                      }
                    />
                  )}
                </div>
                {showSkillSug && filteredSkills.length > 0 && (
                  <div className="sug-drop">
                    {filteredSkills.slice(0, 6).map((s) => (
                      <div
                        key={s}
                        className="sug-item"
                        onMouseDown={() => addSkill(s)}
                      >
                        🛠 {s}
                      </div>
                    ))}
                  </div>
                )}
                {errors.skills && (
                  <span className="err-txt">⚠️ {errors.skills}</span>
                )}
              </div>

              {/* Location */}
              <div className="mf-group" style={{ position: "relative" }}>
                <label>Current Location *</label>
                <input
                  type="text"
                  placeholder="Enter your current city..."
                  value={applyForm.location}
                  className={errors.location ? "inp-err" : ""}
                  onChange={(e) => {
                    setApplyForm({ ...applyForm, location: e.target.value });
                    setShowLocSug(true);
                  }}
                  onFocus={() => setShowLocSug(true)}
                  onBlur={() => setTimeout(() => setShowLocSug(false), 200)}
                />
                {showLocSug &&
                  applyForm.location &&
                  filteredLocs.length > 0 && (
                    <div className="sug-drop">
                      {filteredLocs.slice(0, 5).map((l) => (
                        <div
                          key={l}
                          className="sug-item"
                          onMouseDown={() => {
                            setApplyForm({ ...applyForm, location: l });
                            setShowLocSug(false);
                          }}
                        >
                          📍 {l}
                        </div>
                      ))}
                    </div>
                  )}
                {errors.location && (
                  <span className="err-txt">⚠️ {errors.location}</span>
                )}
              </div>

              {/* Cover Letter */}
              <div className="mf-group">
                <label>
                  Cover Letter * <span className="sub-lbl">(min 30 chars)</span>
                </label>
                <textarea
                  rows={4}
                  placeholder="Tell them why you're perfect for this role..."
                  value={applyForm.coverLetter}
                  className={errors.coverLetter ? "inp-err" : ""}
                  onChange={(e) =>
                    setApplyForm({ ...applyForm, coverLetter: e.target.value })
                  }
                />
                <span
                  className="char-cnt"
                  style={{
                    color:
                      applyForm.coverLetter.length < 30 ? "#ef4444" : "#10b981",
                  }}
                >
                  {applyForm.coverLetter.length} / 30 min
                </span>
                {errors.coverLetter && (
                  <span className="err-txt">⚠️ {errors.coverLetter}</span>
                )}
              </div>

              <div className="modal-btns">
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-submit"
                  disabled={applying || !isFormValid()}
                  style={{
                    background: isFormValid()
                      ? `linear-gradient(135deg, ${colors[0]}, ${colors[1]})`
                      : "#cbd5e1",
                  }}
                >
                  {applying ? "Submitting..." : "Submit Application →"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobDetail;
