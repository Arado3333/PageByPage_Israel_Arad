"use client";

import { useEffect, useState } from "react";
import { User, Lock, Bell, Eye, EyeOff, Save, Sparkles } from "lucide-react";
import "../style/Settings.css";
import PageTransition from "../components/PageTransition";

export default function SettingsPage() {
  const [message, setMessage] = useState({
    success: null,
    message: "",
  });

  const [activeTab, setActiveTab] = useState("profile");
  const [showPassword, setShowPassword] = useState(false);
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    bio: "",
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    bookUpdates: true,
    systemUpdates: true,
  });

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNotificationChange = (e) => {
    const { name, checked } = e.target;
    setNotificationSettings((prev) => ({ ...prev, [name]: checked }));
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();

    const { name, email, bio } = profileData;
    const { currentPasswd, newPassword } = passwordData;
    const userKeys = JSON.parse(sessionStorage.getItem("user"));

    const objToPUT = {
      name: name,
      email: email,
      currentPasswd: currentPasswd,
      newPassword: newPassword,
      bio: bio,
    };

    try {
      fetch(`http://localhost:5500/api/users/${userKeys.userID}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${userKeys.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(objToPUT),
      }).then((res) => {
        if (res.ok) {
          res.json().then((data) => {
            setMessage({
              success: true,
              message: data.message || "Profile updated successfully.",
            });
          });
        } else {
          setMessage("Failed to update profile.");
        }
      });
    } catch (error) {
      setMessage("An error occurred while updating profile.");
    }
  };

  const handleSavePassword = (e) => {
    e.preventDefault();
    const { currentPassword, newPassword } = passwordData;
    if (currentPassword == newPassword) {
      setMessage("Cannot update: old and new passwords are identical");
    }
    handleSaveProfile(e);
  };

  const handleSaveNotifications = (e) => {
    e.preventDefault();
    localStorage.setItem("notifications", JSON.stringify(notificationSettings));
    setMessage((prev) => ({
      ...prev,
      success: true,
      message: "Notification preferences saved!",
    }));
  };

  useEffect(() => {
    setTimeout(() => {
      setMessage((prev) => ({ ...prev, success: null, message: "" }));
    }, 5000);
  }, [message.message]);

  return (
    <PageTransition>
      <div className="min-h-screen text-slate-800">
        {/* Decorative blobs */}
        <div className="pointer-events-none fixed -z-10 inset-0 overflow-hidden">
          <div className="absolute -top-16 -left-24 h-72 w-72 rounded-full bg-gradient-to-tr from-indigo-300 to-purple-300 blur-3xl opacity-40" />
          <div className="absolute -bottom-24 -right-10 h-80 w-80 rounded-full bg-gradient-to-tr from-emerald-200 to-cyan-200 blur-3xl opacity-40" />
          <div className="absolute top-1/2 left-1/2 h-64 w-64 rounded-full bg-gradient-to-tr from-pink-200 to-rose-300 blur-3xl opacity-30" />
        </div>

        <div className="mx-auto max-w-[1600px] 2xl:max-w-[1760px] 3xl:max-w-[1920px] px-2 lg:px-4 xl:px-6 2xl:px-8 3xl:px-10 py-8 2xl:py-12 3xl:py-16 w-full">
          {/* Hero Section */}
          <section className="rounded-2xl bg-white shadow-md ring-1 ring-slate-200 p-4 sm:p-6 lg:p-8 2xl:p-12 3xl:p-16 mb-6 2xl:mb-8 3xl:mb-12 w-full">
            <div className="flex items-center gap-3 mb-4">
              <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1 text-sm 2xl:text-base 3xl:text-lg">
                <Sparkles className="w-4 h-4" />
                Settings
              </div>
            </div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl 2xl:text-5xl 3xl:text-6xl font-serif text-[#0F1A2E] mb-2">
              Account Settings
            </h1>
            <p className="text-base sm:text-lg 2xl:text-xl 3xl:text-2xl text-slate-600">
              Manage your profile, security, and preferences
            </p>
          </section>

          <div className="settings-container">
            <div className="settings-content">
              <div className="settings-sidebar">
                <button
                  className={`sidebar-button text-sm 2xl:text-base 3xl:text-lg ${
                    activeTab === "profile" ? "active" : ""
                  }`}
                  onClick={() => setActiveTab("profile")}
                >
                  <User className="sidebar-icon h-5 w-5 2xl:h-6 2xl:w-6 3xl:h-7 3xl:w-7" />
                  Profile
                </button>
                <button
                  className={`sidebar-button text-sm 2xl:text-base 3xl:text-lg ${
                    activeTab === "security" ? "active" : ""
                  }`}
                  onClick={() => setActiveTab("security")}
                >
                  <Lock className="sidebar-icon h-5 w-5 2xl:h-6 2xl:w-6 3xl:h-7 3xl:w-7" />
                  Security
                </button>
                <button
                  className={`sidebar-button text-sm 2xl:text-base 3xl:text-lg ${
                    activeTab === "notifications" ? "active" : ""
                  }`}
                  onClick={() => setActiveTab("notifications")}
                >
                  <Bell className="sidebar-icon h-5 w-5 2xl:h-6 2xl:w-6 3xl:h-7 3xl:w-7" />
                  Notifications
                </button>
              </div>

              <div className="settings-main">
                {message.success == true ? (
                  <div className="auth-success">
                    <p className="text-sm 2xl:text-base 3xl:text-lg">
                      {message.message}
                    </p>
                  </div>
                ) : message.success == false ? (
                  <div className="auth-error">
                    <p className="text-sm 2xl:text-base 3xl:text-lg">
                      {message.message}
                    </p>
                  </div>
                ) : (
                  <div className="auth-none">
                    <p className="text-sm 2xl:text-base 3xl:text-lg">
                      {message.message}
                    </p>
                  </div>
                )}

                {activeTab === "profile" && (
                  <div className="profile-section">
                    <h2 className="section-title text-lg 2xl:text-xl 3xl:text-2xl">
                      Profile Settings
                    </h2>
                    <form
                      className="settings-form"
                      onSubmit={handleSaveProfile}
                    >
                      <div className="form-group">
                        <label
                          htmlFor="name"
                          className="form-label text-sm 2xl:text-base 3xl:text-lg"
                        >
                          Name
                        </label>
                        <input
                          id="name"
                          name="name"
                          type="text"
                          className="form-input text-sm 2xl:text-base 3xl:text-lg"
                          value={profileData.name}
                          onChange={handleProfileChange}
                          placeholder="Your name"
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label
                          htmlFor="email"
                          className="form-label text-sm 2xl:text-base 3xl:text-lg"
                        >
                          Email
                        </label>
                        <input
                          id="email"
                          name="email"
                          type="email"
                          className="form-input text-sm 2xl:text-base 3xl:text-lg"
                          value={profileData.email}
                          onChange={handleProfileChange}
                          placeholder="Your email"
                        />
                      </div>
                      <div className="form-group">
                        <label
                          htmlFor="bio"
                          className="form-label text-sm 2xl:text-base 3xl:text-lg"
                        >
                          Bio
                        </label>
                        <textarea
                          id="bio"
                          name="bio"
                          className="form-textarea text-sm 2xl:text-base 3xl:text-lg"
                          value={profileData.bio}
                          onChange={handleProfileChange}
                          placeholder="Tell us about yourself"
                        ></textarea>
                      </div>
                      <button
                        type="submit"
                        className="settings-button primary text-sm 2xl:text-base 3xl:text-lg bg-gradient-to-r from-indigo-700 to-violet-700 hover:from-indigo-800 hover:to-violet-800 text-white border-0 rounded-xl shadow-sm hover:shadow-md transition-all duration-200"
                      >
                        <Save className="button-icon h-5 w-5 2xl:h-6 2xl:w-6 3xl:h-7 3xl:w-7" />
                        Save Profile
                      </button>
                    </form>
                  </div>
                )}

                {activeTab === "security" && (
                  <div className="security-section">
                    <h2 className="section-title text-lg 2xl:text-xl 3xl:text-2xl">
                      Security Settings
                    </h2>
                    <form
                      className="settings-form"
                      onSubmit={handleSavePassword}
                    >
                      <div className="form-group">
                        <label
                          htmlFor="currentPassword"
                          className="form-label text-sm 2xl:text-base 3xl:text-lg"
                        >
                          Current Password
                        </label>
                        <div className="password-input-container">
                          <input
                            id="currentPassword"
                            name="currentPassword"
                            type={showPassword ? "text" : "password"}
                            className="form-input text-sm 2xl:text-base 3xl:text-lg"
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
                            {showPassword ? (
                              <EyeOff className="password-icon h-5 w-5 2xl:h-6 2xl:w-6 3xl:h-7 3xl:w-7" />
                            ) : (
                              <Eye className="password-icon h-5 w-5 2xl:h-6 2xl:w-6 3xl:h-7 3xl:w-7" />
                            )}
                          </button>
                        </div>
                      </div>
                      <div className="form-group">
                        <label
                          htmlFor="newPassword"
                          className="form-label text-sm 2xl:text-base 3xl:text-lg"
                        >
                          New Password
                        </label>
                        <div className="password-input-container">
                          <input
                            id="newPassword"
                            name="newPassword"
                            type={showPassword ? "text" : "password"}
                            className="form-input text-sm 2xl:text-base 3xl:text-lg"
                            value={passwordData.newPassword}
                            onChange={handlePasswordChange}
                            placeholder="Enter new password"
                            required
                          />
                        </div>
                      </div>
                      <div className="form-group">
                        <label
                          htmlFor="confirmPassword"
                          className="form-label text-sm 2xl:text-base 3xl:text-lg"
                        >
                          Confirm Password
                        </label>
                        <div className="password-input-container">
                          <input
                            id="confirmPassword"
                            name="confirmPassword"
                            type={showPassword ? "text" : "password"}
                            className="form-input text-sm 2xl:text-base 3xl:text-lg"
                            value={passwordData.confirmPassword}
                            onChange={handlePasswordChange}
                            placeholder="Confirm new password"
                            required
                          />
                        </div>
                      </div>
                      <button
                        type="submit"
                        className="settings-button primary text-sm 2xl:text-base 3xl:text-lg bg-gradient-to-r from-indigo-700 to-violet-700 hover:from-indigo-800 hover:to-violet-800 text-white border-0 rounded-xl shadow-sm hover:shadow-md transition-all duration-200"
                      >
                        <Save className="button-icon h-5 w-5 2xl:h-6 2xl:w-6 3xl:h-7 3xl:w-7" />
                        Update Password
                      </button>
                    </form>
                  </div>
                )}

                {activeTab === "notifications" && (
                  <div className="notifications-section">
                    <h2 className="section-title text-lg 2xl:text-xl 3xl:text-2xl">
                      Notification Settings
                    </h2>
                    <form
                      className="settings-form"
                      onSubmit={handleSaveNotifications}
                    >
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
                          <label
                            htmlFor="emailNotifications"
                            className="checkbox-label text-sm 2xl:text-base 3xl:text-lg"
                          >
                            Email Notifications
                          </label>
                        </div>
                        <p className="form-help text-xs 2xl:text-sm 3xl:text-base">
                          Receive notifications via email
                        </p>
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
                          <label
                            htmlFor="bookUpdates"
                            className="checkbox-label text-sm 2xl:text-base 3xl:text-lg"
                          >
                            Book Updates
                          </label>
                        </div>
                        <p className="form-help text-xs 2xl:text-sm 3xl:text-base">
                          Receive notifications about book updates
                        </p>
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
                          <label
                            htmlFor="systemUpdates"
                            className="checkbox-label text-sm 2xl:text-base 3xl:text-lg"
                          >
                            System Updates
                          </label>
                        </div>
                        <p className="form-help text-xs 2xl:text-sm 3xl:text-base">
                          Receive notifications about system updates
                        </p>
                      </div>
                      <button
                        type="submit"
                        className="settings-button primary text-sm 2xl:text-base 3xl:text-lg bg-gradient-to-r from-indigo-700 to-violet-700 hover:from-indigo-800 hover:to-violet-800 text-white border-0 rounded-xl shadow-sm hover:shadow-md transition-all duration-200"
                      >
                        <Save className="button-icon h-5 w-5 2xl:h-6 2xl:w-6 3xl:h-7 3xl:w-7" />
                        Save Preferences
                      </button>
                    </form>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
