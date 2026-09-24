import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="footer">

      <div className="footer-content">

        <h2>CourseHub</h2>

        <p>
          Learn new skills, improve your knowledge,
          and build your future with CourseHub.
        </p>

      </div>

      <div className="footer-links">

        <Link to="/">Home</Link>

        <Link to="/#courses">Courses</Link>

        <Link to="/#about">About</Link>

        <Link to="/login">Login</Link>

        <Link to="/register">Register</Link>

      </div>

      <div className="footer-bottom">

        <p>
          © 2026 CourseHub. All rights reserved.
        </p>

      </div>

    </footer>
  );
}

export default Footer;