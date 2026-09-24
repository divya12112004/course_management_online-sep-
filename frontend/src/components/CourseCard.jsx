import { Link } from "react-router-dom";

function CourseCard({ id, title, description, level, duration }) {
  return (
    <div className="course-card">

      <h3>{title}</h3>

      <p>{description}</p>

      <div className="course-info">
        <span>{level}</span>
        <span>{duration}</span>
      </div>

      <Link
        to={`/course-details/${id}`}
        className="course-button"
      >
        View Course
      </Link>

    </div>
  );
}

export default CourseCard;