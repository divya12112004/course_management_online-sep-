import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const [profileOpen, setProfileOpen] = useState(false);

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setProfileOpen(false);

    navigate("/");
  };

  const firstLetter = user?.name
    ? user.name.charAt(0).toUpperCase()
    : "U";


  // Navigate to a section on the Home page
  const handleSectionClick = (sectionId) => {

    setProfileOpen(false);

    // If already on Home
    if (window.location.pathname === "/") {

      const section = document.getElementById(sectionId);

      if (section) {
        section.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });
      }

    } else {

      // If on another page, go Home first
      navigate("/");

      setTimeout(() => {

        const section = document.getElementById(sectionId);

        if (section) {
          section.scrollIntoView({
            behavior: "smooth",
            block: "start"
          });
        }

      }, 300);
    }
  };


  return (
    <nav className="navbar">

      {/* Logo */}
      <Link to="/" className="navbar-logo">
        Course<span>Hub</span>
      </Link>


      <div className="nav-links">

        {/* Home */}
        <Link to="/">
          Home
        </Link>


        {/* Courses */}
        <button
          className="nav-section-link"
          onClick={() => handleSectionClick("courses")}
        >
          Courses
        </button>


        {/* About */}
        <button
          className="nav-section-link"
          onClick={() => handleSectionClick("about")}
        >
          About
        </button>


        {/* Logged in user */}
        {token && user ? (

          <>

            <Link to="/dashboard">
              My Courses
            </Link>


            {user.role === "admin" && (

              <Link
                to="/admin"
                className="admin-nav-btn"
              >
                Admin Panel
              </Link>

            )}


            {/* Notification */}
            <button
              className="notification-btn"
              title="Notifications"
            >
              🔔
              <span className="notification-dot"></span>
            </button>


            {/* Profile */}
            <div className="profile-wrapper">

              <button
                className="profile-trigger"
                onClick={() =>
                  setProfileOpen(!profileOpen)
                }
              >

                <div className="profile-avatar">
                  {firstLetter}
                </div>

                <span className="profile-name">
                  {user.name}
                </span>

                <span
                  className={`profile-arrow ${
                    profileOpen ? "open" : ""
                  }`}
                >
                  ▾
                </span>

              </button>


              {profileOpen && (

                <div className="profile-dropdown">

                  <Link
                    to="/profile"
                    onClick={() =>
                      setProfileOpen(false)
                    }
                  >
                    <span>👤</span>
                    Profile
                  </Link>


                  <button
                    onClick={() => {
                      setProfileOpen(false);
                      alert(
                        "Settings will be available soon."
                      );
                    }}
                  >
                    <span>⚙️</span>
                    Settings
                  </button>


                  <div className="dropdown-divider"></div>


                  <button
                    className="dropdown-logout"
                    onClick={handleLogout}
                  >
                    <span>↪</span>
                    Logout
                  </button>

                </div>

              )}

            </div>

          </>

        ) : (

          <>
            <Link to="/login">
              Login
            </Link>

            <Link to="/register">
              Register
            </Link>
          </>

        )}

      </div>

    </nav>
  );
}

export default Navbar;