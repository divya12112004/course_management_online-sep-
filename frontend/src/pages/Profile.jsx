import { useEffect, useState } from "react";
import api from "../axiosConfig";

function Profile() {
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState("Loading profile...");

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setMessage("Please login first.");
      return;
    }

    api
      .get("/api/profile", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then((response) => {
        setUser(response.data.user);
        setMessage("");
      })
      .catch((error) => {
        console.error("Profile error:", error);

        if (error.response?.status !== 401) {
          setMessage(
            error.response?.data?.message ||
              "Unable to load profile."
          );
        }
      });
  }, []);

  /* Loading / error */

  if (message) {
    return (
      <div className="profile-page">
        <div className="profile-loading">
          <div className="profile-loading-icon">
            👤
          </div>

          <h2>{message}</h2>
        </div>
      </div>
    );
  }

  const firstLetter = user?.name
    ? user.name.charAt(0).toUpperCase()
    : "U";

  const memberDate = new Date(
    user.created_at
  ).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric"
  });

  return (
    <div className="profile-page">

      {/* Header */}

      <div className="profile-header">

        <p className="profile-tag">
          ACCOUNT
        </p>

        <h1>
          My Profile
        </h1>

        <p>
          Manage and view your CourseHub account information.
        </p>

      </div>


      {/* Main Profile Card */}

      <div className="profile-container">

        <div className="profile-main-card">

          {/* Profile top */}

          <div className="profile-cover">

            <div className="profile-large-avatar">
              {firstLetter}
            </div>

          </div>


          <div className="profile-content">

            <h2>
              {user.name}
            </h2>

            <p className="profile-email">
              {user.email}
            </p>


            {/* Account badge */}

            <div className="profile-role">

              <span className="role-icon">
                {user.role === "admin"
                  ? "🛡️"
                  : "🎓"}
              </span>

              <div>
                <strong>
                  {user.role === "admin"
                    ? "Administrator"
                    : "Student"}
                </strong>

                <span>
                  CourseHub Account
                </span>
              </div>

            </div>

          </div>

        </div>


        {/* Account Information */}

        <div className="profile-info-card">

          <div className="profile-card-heading">

            <div>
              <p>
                ACCOUNT INFORMATION
              </p>

              <h2>
                Personal Details
              </h2>
            </div>

            <span className="info-icon">
              ℹ
            </span>

          </div>


          <div className="profile-details-grid">

            <div className="profile-detail">

              <span className="detail-icon">
                👤
              </span>

              <div>
                <small>
                  Full Name
                </small>

                <strong>
                  {user.name}
                </strong>
              </div>

            </div>


            <div className="profile-detail">

              <span className="detail-icon">
                ✉️
              </span>

              <div>
                <small>
                  Email Address
                </small>

                <strong>
                  {user.email}
                </strong>
              </div>

            </div>


            <div className="profile-detail">

              <span className="detail-icon">
                🛡️
              </span>

              <div>
                <small>
                  Account Role
                </small>

                <strong>
                  {user.role === "admin"
                    ? "Administrator"
                    : "Student"}
                </strong>
              </div>

            </div>


            <div className="profile-detail">

              <span className="detail-icon">
                📅
              </span>

              <div>
                <small>
                  Member Since
                </small>

                <strong>
                  {memberDate}
                </strong>
              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Profile;