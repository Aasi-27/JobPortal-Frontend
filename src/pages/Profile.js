import React, { useEffect, useState } from "react";
import { getProfile, updateProfile } from "../services/api";
import "./Profile.css";

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
  "Kolkata, West Bengal",
  "Ahmedabad, Gujarat",
  "Kochi, Kerala",
];

const EXPERIENCE_OPTIONS = [
  "Fresher",
  "0-1 years",
  "1-2 years",
  "2-3 years",
  "3+ years",
];

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({});
  const [skillList, setSkillList] = useState([]);
  const [skillInput, setSkillInput] = useState("");
  const [showSkillSuggestions, setShowSkillSuggestions] = useState(false);
  const [showLocationSuggestions, setShowLocationSuggestions] = useState(false);
  const [errors, setErrors] = useState({});
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await getProfile();
      setProfile(res.data);
      setForm({
        name: res.data.name || "",
        phone: res.data.phone || "+91",
        location: res.data.location || "",
        experience: res.data.experience || "",
        linkedin: res.data.linkedin || "",
        github: res.data.github || "",
      });
      if (res.data.skills) {
        setSkillList(
          res.data.skills
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean),
        );
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const validatePhone = (phone) => {
    if (!phone || phone === "+91") return true;
    const phoneRegex = /^\+91[6-9]\d{9}$/;
    return phoneRegex.test(phone.replace(/\s/g, ""));
  };

  const handlePhoneChange = (value) => {
    if (!value.startsWith("+91")) value = "+91";
    const digits = value.slice(3).replace(/\D/g, "").slice(0, 10);
    setForm({ ...form, phone: "+91" + digits });
    if (errors.phone) setErrors({ ...errors, phone: "" });
  };

  const addSkill = (skill) => {
    const trimmed = skill.trim();
    if (trimmed && !skillList.includes(trimmed) && skillList.length < 10) {
      setSkillList([...skillList, trimmed]);
      if (errors.skills) setErrors({ ...errors, skills: "" });
    }
    setSkillInput("");
    setShowSkillSuggestions(false);
  };

  const removeSkill = (skill) =>
    setSkillList(skillList.filter((s) => s !== skill));

  const handleSkillKeyDown = (e) => {
    if (e.key === "Enter" && skillInput.trim()) {
      e.preventDefault();
      addSkill(skillInput.trim());
    }
  };

  const filteredSkills = SKILL_SUGGESTIONS.filter(
    (s) =>
      s.toLowerCase().includes(skillInput.toLowerCase()) &&
      !skillList.includes(s),
  );

  const filteredLocations = LOCATION_SUGGESTIONS.filter((l) =>
    l.toLowerCase().includes((form.location || "").toLowerCase()),
  );

  const validate = () => {
    const newErrors = {};
    if (!form.name?.trim()) newErrors.name = "Name is required";
    if (form.phone && form.phone !== "+91" && !validatePhone(form.phone))
      newErrors.phone = "Enter valid mobile number";
    if (!form.location?.trim()) newErrors.location = "Location is required";
    if (!form.experience)
      newErrors.experience = "Please select your experience";
    if (skillList.length === 0) newErrors.skills = "Add at least one skill";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) {
      setMsg("❌Enter the valid details");
      setTimeout(() => setMsg(""), 3000);
      return;
    }
    try {
      const payload = {
        name: form.name.trim(),
        phone: form.phone !== "+91" ? form.phone : "",
        location: form.location.trim(),
        experience: form.experience,
        skills: skillList.join(", "),
        linkedin: form.linkedin?.trim() || "",
        github: form.github?.trim() || "",
      };
      const res = await updateProfile(payload);
      setProfile(res.data);
      setEditing(false);
      setErrors({});
      setMsg("✅ Profile updated successfully!");
      setTimeout(() => setMsg(""), 3000);
    } catch {
      setMsg("❌ Failed to update profile. Try again.");
      setTimeout(() => setMsg(""), 3000);
    }
  };

  const handleCancel = () => {
    setEditing(false);
    setForm({
      name: profile?.name || "",
      phone: profile?.phone || "+91",
      location: profile?.location || "",
      experience: profile?.experience || "",
      linkedin: profile?.linkedin || "",
      github: profile?.github || "",
    });
    if (profile?.skills)
      setSkillList(
        profile.skills
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
      );
    else setSkillList([]);
    setErrors({});
  };

  if (loading) return <div className="profile-loading">Loading profile...</div>;

  return (
    <div className="profile-page">
      <div className="profile-hero">
        <div className="container">
          <div className="profile-header">
            <div className="profile-avatar-large">
              {profile?.name?.charAt(0).toUpperCase()}
            </div>
            <div className="profile-header-info">
              <h1>{profile?.name}</h1>
              <p>{profile?.email}</p>
              <span className={`role-badge ${profile?.role?.toLowerCase()}`}>
                {profile?.role}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="container profile-content">
        {msg && (
          <div
            className={`profile-msg ${msg.includes("✅") ? "success" : "error"}`}
          >
            {msg}
          </div>
        )}

        <div className="profile-card">
          <div className="profile-card-header">
            <h2>Personal Information</h2>
            {!editing ? (
              <button
                className="btn-edit-profile"
                onClick={() => setEditing(true)}
              >
                ✏️ Edit Profile
              </button>
            ) : (
              <div className="edit-actions">
                <button className="btn-cancel-edit" onClick={handleCancel}>
                  Cancel
                </button>
                <button className="btn-save-profile" onClick={handleSave}>
                  Save Changes
                </button>
              </div>
            )}
          </div>

          {!editing ? (
            <div className="profile-fields">
              {[
                { label: "Full Name", value: profile?.name },
                { label: "Phone", value: profile?.phone },
                { label: "Location", value: profile?.location },
                { label: "Experience", value: profile?.experience },
                { label: "LinkedIn", value: profile?.linkedin },
                { label: "GitHub", value: profile?.github },
              ].map((field) => (
                <div className="profile-field" key={field.label}>
                  <label>{field.label}</label>
                  <p className={!field.value ? "empty-field" : ""}>
                    {field.value || "Not provided"}
                  </p>
                </div>
              ))}
              <div className="profile-field full-width">
                <label>Skills</label>
                {skillList.length > 0 ? (
                  <div className="skills-view">
                    {skillList.map((s) => (
                      <span key={s} className="skill-tag-view">
                        {s}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="empty-field">Not provided</p>
                )}
              </div>
            </div>
          ) : (
            <div className="edit-form">
              {/* Name */}
              <div className="pf-group">
                <label>Full Name *</label>
                <input
                  type="text"
                  placeholder="Your full name"
                  value={form.name}
                  className={errors.name ? "input-error" : ""}
                  onChange={(e) => {
                    setForm({ ...form, name: e.target.value });
                    setErrors({ ...errors, name: "" });
                  }}
                />
                {errors.name && (
                  <span className="error-msg">⚠️ {errors.name}</span>
                )}
              </div>

              {/* Phone */}
              <div className="pf-group">
                <label>Phone Number</label>
                <div
                  className={`phone-input-wrapper ${errors.phone ? "input-error-border" : ""}`}
                >
                  <span className="phone-flag">🇮🇳 +91</span>
                  <input
                    type="tel"
                    placeholder="Enter mobile number"
                    value={form.phone?.slice(3) || ""}
                    onChange={(e) => handlePhoneChange("+91" + e.target.value)}
                    maxLength={10}
                  />
                  {form.phone?.length === 13 && validatePhone(form.phone) && (
                    <span className="input-valid">✅</span>
                  )}
                </div>
                {errors.phone && (
                  <span className="error-msg">⚠️ {errors.phone}</span>
                )}
              </div>

              {/* Location */}
              <div className="pf-group" style={{ position: "relative" }}>
                <label>Location *</label>
                <input
                  type="text"
                  placeholder="Enter your location"
                  value={form.location}
                  className={errors.location ? "input-error" : ""}
                  onChange={(e) => {
                    setForm({ ...form, location: e.target.value });
                    setShowLocationSuggestions(true);
                    setErrors({ ...errors, location: "" });
                  }}
                  onFocus={() => setShowLocationSuggestions(true)}
                  onBlur={() =>
                    setTimeout(() => setShowLocationSuggestions(false), 200)
                  }
                />
                {showLocationSuggestions &&
                  form.location &&
                  filteredLocations.length > 0 && (
                    <div className="suggestions-dropdown">
                      {filteredLocations.slice(0, 5).map((loc) => (
                        <div
                          key={loc}
                          className="suggestion-item"
                          onMouseDown={() => {
                            setForm({ ...form, location: loc });
                            setShowLocationSuggestions(false);
                            setErrors({ ...errors, location: "" });
                          }}
                        >
                          📍 {loc}
                        </div>
                      ))}
                    </div>
                  )}
                {errors.location && (
                  <span className="error-msg">⚠️ {errors.location}</span>
                )}
              </div>

              {/* Experience */}
              <div className="pf-group">
                <label>Experience *</label>
                <div className="experience-options">
                  {EXPERIENCE_OPTIONS.map((exp) => (
                    <button
                      type="button"
                      key={exp}
                      className={`exp-btn ${form.experience === exp ? "selected" : ""}`}
                      onClick={() => {
                        setForm({ ...form, experience: exp });
                        setErrors({ ...errors, experience: "" });
                      }}
                    >
                      {exp}
                    </button>
                  ))}
                </div>
                {errors.experience && (
                  <span className="error-msg">⚠️ {errors.experience}</span>
                )}
              </div>

              {/* Skills */}
              <div className="pf-group full-width">
                <label>Skills *</label>
                <div
                  className={`skills-container ${errors.skills ? "input-error-border" : ""}`}
                >
                  {skillList.map((skill) => (
                    <span key={skill} className="skill-tag">
                      {skill}{" "}
                      <button type="button" onClick={() => removeSkill(skill)}>
                        ✕
                      </button>
                    </span>
                  ))}
                  {skillList.length < 10 && (
                    <input
                      type="text"
                      className="skill-input"
                      placeholder={
                        skillList.length === 0
                          ? "Type skill and press Enter..."
                          : "Add more..."
                      }
                      value={skillInput}
                      onChange={(e) => {
                        setSkillInput(e.target.value);
                        setShowSkillSuggestions(true);
                      }}
                      onKeyDown={handleSkillKeyDown}
                      onFocus={() => setShowSkillSuggestions(true)}
                      onBlur={() =>
                        setTimeout(() => setShowSkillSuggestions(false), 200)
                      }
                    />
                  )}
                </div>
                {showSkillSuggestions && filteredSkills.length > 0 && (
                  <div className="suggestions-dropdown">
                    {filteredSkills.slice(0, 6).map((skill) => (
                      <div
                        key={skill}
                        className="suggestion-item"
                        onMouseDown={() => addSkill(skill)}
                      >
                        🛠 {skill}
                      </div>
                    ))}
                  </div>
                )}
                {errors.skills && (
                  <span className="error-msg">⚠️ {errors.skills}</span>
                )}
              </div>

              {/* LinkedIn */}
              <div className="pf-group">
                <label>
                  LinkedIn URL <span className="hint-inline">(optional)</span>
                </label>
                <input
                  type="url"
                  placeholder="https://linkedin.com/in/yourname"
                  value={form.linkedin}
                  onChange={(e) =>
                    setForm({ ...form, linkedin: e.target.value })
                  }
                />
              </div>

              {/* GitHub */}
              <div className="pf-group">
                <label>
                  GitHub URL <span className="hint-inline">(optional)</span>
                </label>
                <input
                  type="url"
                  placeholder="https://github.com/yourusername"
                  value={form.github}
                  onChange={(e) => setForm({ ...form, github: e.target.value })}
                />
              </div>
            </div>
          )}
        </div>

        <div className="profile-card account-card">
          <h2>Account Details</h2>
          <div className="account-info">
            <div className="account-item">
              <span className="account-label">Email</span>
              <span className="account-value">{profile?.email}</span>
            </div>
            <div className="account-item">
              <span className="account-label">Role</span>
              <span className={`role-badge ${profile?.role?.toLowerCase()}`}>
                {profile?.role}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
