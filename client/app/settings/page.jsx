"use client"

import { useEffect, useState } from "react"
import { User, Lock, Bell, Eye, EyeOff, Save } from "lucide-react"
import "../style/Settings.css"

export default function SettingsPage() {
  const [message, setMessage] = useState({
    success: null,
    message: ""
  });

  const [activeTab, setActiveTab] = useState("profile")
  const [showPassword, setShowPassword] = useState(false)
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    bio: "",
  })
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    bookUpdates: true,
    systemUpdates: true,
  })

  const handleProfileChange = (e) => {
    const { name, value } = e.target
    setProfileData((prev) => ({ ...prev, [name]: value }))
  }

  const handlePasswordChange = (e) => {
    const { name, value } = e.target
    setPasswordData((prev) => ({ ...prev, [name]: value }))
  }

  const handleNotificationChange = (e) => {
    const { name, checked } = e.target
    setNotificationSettings((prev) => ({ ...prev, [name]: checked }))
  }

  const handleSaveProfile = (e) => {
    e.preventDefault()

    const {name, email, bio} = profileData;
    const {currentPasswd, newPassword} = passwordData;
    const userKeys = JSON.parse(sessionStorage.getItem('user'));
    
    const objToPUT = {
      name: name,
      email: email,
      currentPasswd: currentPasswd,
      newPassword: newPassword,
      bio: bio
    };

    try {
      fetch(`http://localhost:5500/api/users/${userKeys.userID}`, {
      method: "PUT",
      headers: {
        "Authorization": `Bearer ${userKeys.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(objToPUT),
    })
      .then((res) => {
        if (res.ok) {
          res.json().then((data) => {
            setMessage({
              success: true,
              message: data.message || "Profile updated successfully."
            });
          });
        } else {
          setMessage("Failed to update profile.");
        }
      })
    } catch (error) {
      setMessage("An error occurred while updating profile.");
    }
  }

  const handleSavePassword = (e) => {
    e.preventDefault()
    const {currentPassword, newPassword} = passwordData;
    if (currentPassword == newPassword)
    {
      setMessage("Cannot update: old and new passwords are identical");
    }
    handleSaveProfile(e);
  }

  const handleSaveNotifications = (e) => {
    e.preventDefault()
    localStorage.setItem('notifications', JSON.stringify(notificationSettings));
    setMessage((prev) => ({...prev, success: true, message: "Notification preferences saved!"}));
  }

  useEffect(() => {
    setTimeout(() => {
      setMessage((prev) => ({...prev, success: null, message: ""}));
    }, 5000);
  }, [message.message])

  return (
    <div className="settings-container">
      <div className="settings-header">
        <h1 className="page-title">Settings</h1>
      </div>

      <div className="settings-content">
        <div className="settings-sidebar">
          <button
            className={`sidebar-button ${activeTab === "profile" ? "active" : ""}`}
            onClick={() => setActiveTab("profile")}
          >
            <User className="sidebar-icon" />
            Profile
          </button>
          <button
            className={`sidebar-button ${activeTab === "security" ? "active" : ""}`}
            onClick={() => setActiveTab("security")}
          >
            <Lock className="sidebar-icon" />
            Security
          </button>
          <button
            className={`sidebar-button ${activeTab === "notifications" ? "active" : ""}`}
            onClick={() => setActiveTab("notifications")}
          >
            <Bell className="sidebar-icon" />
            Notifications
          </button>
        </div>

        <div className="settings-main">

          {message.success == true ? <div className="auth-success">
           <p>{message.message}</p>
            </div> : message.success == false ? <div className="auth-error">
           <p>{message.message}</p>
            </div> : <div className="auth-none">
           <p>{message.message}</p>
            </div>}

          {activeTab === "profile" && (
            <div className="profile-section">
              <h2 className="section-title">Profile Settings</h2>
              <form className="settings-form" onSubmit={handleSaveProfile}>
                <div className="form-group">
                  <label htmlFor="name" className="form-label">
                    Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    className="form-input"
                    value={profileData.name}
                    onChange={handleProfileChange}
                    placeholder="Your name"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="email" className="form-label">
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    className="form-input"
                    value={profileData.email}
                    onChange={handleProfileChange}
                    placeholder="Your email"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="bio" className="form-label">
                    Bio
                  </label>
                  <textarea
                    id="bio"
                    name="bio"
                    className="form-textarea"
                    value={profileData.bio}
                    onChange={handleProfileChange}
                    placeholder="Tell us about yourself"
                  ></textarea>
                </div>
                <button type="submit" className="settings-button primary">
                  <Save className="button-icon" />
                  Save Profile
                </button>
              </form>
            </div>
          )}

          {activeTab === "security" && (
            <div className="security-section">
              <h2 className="section-title">Security Settings</h2>
              <form className="settings-form" onSubmit={handleSavePassword}>
                <div className="form-group">
                  <label htmlFor="currentPassword" className="form-label">
                    Current Password
                  </label>
                  <div className="password-input-container">
                    <input
                      id="currentPassword"
                      name="currentPassword"
                      type={showPassword ? "text" : "password"}
                      className="form-input"
                      value={passwordData.currentPassword}
                      onChange={handlePasswordChange}
                      placeholder="Enter current password"
                      required
                    />
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() => setShowPassword(!showPassword)}
                      tabIndex="-1"
                    >
                      {showPassword ? <EyeOff className="password-icon" /> : <Eye className="password-icon" />}
                    </button>
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="newPassword" className="form-label">
                    New Password
                  </label>
                  <div className="password-input-container">
                    <input
                      id="newPassword"
                      name="newPassword"
                      type={showPassword ? "text" : "password"}
                      className="form-input"
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                      placeholder="Enter new password"
                      required
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="confirmPassword" className="form-label">
                    Confirm Password
                  </label>
                  <div className="password-input-container">
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showPassword ? "text" : "password"}
                      className="form-input"
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordChange}
                      placeholder="Confirm new password"
                       required
                    />
                  </div>
                </div>
                <button type="submit" className="settings-button primary">
                  <Save className="button-icon" />
                  Update Password
                </button>
              </form>
            </div>
          )}

          {activeTab === "notifications" && (
            <div className="notifications-section">
              <h2 className="section-title">Notification Settings</h2>
              <form className="settings-form" onSubmit={handleSaveNotifications}>
                <div className="form-group">
                  <div className="checkbox-group">
                    <input
                      id="emailNotifications"
                      name="emailNotifications"
                      type="checkbox"
                      className="checkbox-input"
                      checked={notificationSettings.emailNotifications}
                      onChange={handleNotificationChange}
                    />
                    <label htmlFor="emailNotifications" className="checkbox-label">
                      Email Notifications
                    </label>
                  </div>
                  <p className="form-help">Receive notifications via email</p>
                </div>
                <div className="form-group">
                  <div className="checkbox-group">
                    <input
                      id="bookUpdates"
                      name="bookUpdates"
                      type="checkbox"
                      className="checkbox-input"
                      checked={notificationSettings.bookUpdates}
                      onChange={handleNotificationChange}
                    />
                    <label htmlFor="bookUpdates" className="checkbox-label">
                      Book Updates
                    </label>
                  </div>
                  <p className="form-help">Receive notifications about book updates</p>
                </div>
                <div className="form-group">
                  <div className="checkbox-group">
                    <input
                      id="systemUpdates"
                      name="systemUpdates"
                      type="checkbox"
                      className="checkbox-input"
                      checked={notificationSettings.systemUpdates}
                      onChange={handleNotificationChange}
                    />
                    <label htmlFor="systemUpdates" className="checkbox-label">
                      System Updates
                    </label>
                  </div>
                  <p className="form-help">Receive notifications about system updates</p>
                </div>
                <button type="submit" className="settings-button primary">
                  <Save className="button-icon" />
                  Save Preferences
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
