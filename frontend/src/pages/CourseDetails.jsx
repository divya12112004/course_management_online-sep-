import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../axiosConfig";

function CourseDetails() {
  const { id } = useParams();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [enrolling, setEnrolling] = useState(false);
  const [enrolled, setEnrolled] = useState(false);

  // Fetch selected course
  useEffect(() => {
    api
      .get("/api/courses")
      .then((response) => {
        const selectedCourse = response.data.find(
          (item) => item.id === Number(id)
        );

        if (selectedCourse) {
          setCourse(selectedCourse);
        } else {
          setMessage("Course not found.");
        }

        setLoading(false);
      })
      .catch((error) => {
        console.error("Course details error:", error);

        setMessage(
          error.response?.data?.message ||
            "Unable to load course details."
        );

        setLoading(false);
      });
  }, [id]);

  // Check enrollment status
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      return;
    }

    api
      .get("/api/my-courses", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        const alreadyEnrolled = response.data.some(
          (item) => item.id === Number(id)
        );

        setEnrolled(alreadyEnrolled);
      })
      .catch((error) => {
        console.error("Enrollment check error:", error);
      });
  }, [id]);

  // Enroll
  const handleEnroll = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setMessage("Please login before enrolling.");
      return;
    }

    if (enrolled) {
      setMessage("You are already enrolled in this course.");
      return;
    }

    setEnrolling(true);
    setMessage("");

    try {
      const response = await api.post(
        "/api/enroll",
        {
          courseId: course.id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage(response.data.message);
      setEnrolled(true);
    } catch (error) {
      console.error("Enrollment error:", error);

      if (error.response) {
        setMessage(
          error.response.data.message ||
            "Unable to enroll in the course."
        );
      } else {
        setMessage("Unable to connect to the server.");
      }
    } finally {
      setEnrolling(false);
    }
  };

  // Loading
  if (loading) {
    return (
      <div className="course-details-page">
        <div className="course-details">
          <div className="course-details-content">
            <h1>Loading course...</h1>
          </div>
        </div>
      </div>
    );
  }

  // Course not found
  if (!course) {
    return (
      <div className="course-details-page">
        <div className="course-details">
          <div className="course-details-content">
            <h1>Course Not Found</h1>

            <p>
              {message ||
                "The requested course does not exist."}
            </p>

            <Link to="/">← Back to Courses</Link>
          </div>
        </div>
      </div>
    );
  }

  /*
   * Get learning topics based on category.
   *
   * toLowerCase() makes the matching case-insensitive.
   * Example:
   * "Web Development"
   * "web development"
   * "WEB DEVELOPMENT"
   *
   * All will work.
   */

  const category = (course.category || "")
    .trim()
    .toLowerCase();

  let learningTopics = [];

  if (
    category.includes("web") ||
    category.includes("frontend") ||
    category.includes("backend") ||
    category.includes("full stack")
  ) {
    learningTopics = [
      "HTML & CSS",
      "JavaScript",
      "Responsive Web Design",
      "React.js",
      "API Integration",
      "Real-world Projects",
    ];
  } else if (
    category.includes("programming") ||
    category.includes("python") ||
    category.includes("java") ||
    category.includes("c programming")
  ) {
    learningTopics = [
      "Programming Fundamentals",
      "Variables & Data Types",
      "Functions",
      "Object-Oriented Programming",
      "Problem Solving",
      "Practical Projects",
    ];
  } else if (
    category.includes("data") ||
    category.includes("analytics")
  ) {
    learningTopics = [
      "Excel",
      "SQL",
      "Python for Data Analysis",
      "Data Cleaning",
      "Data Visualization",
      "Power BI",
    ];
  } else if (
    category.includes("machine learning") ||
    category.includes("ai") ||
    category.includes("artificial intelligence")
  ) {
    learningTopics = [
      "Machine Learning Fundamentals",
      "Data Preparation",
      "Supervised Learning",
      "Unsupervised Learning",
      "Model Evaluation",
      "Practical AI Projects",
    ];
  } else if (
    category.includes("cloud") ||
    category.includes("devops")
  ) {
    learningTopics = [
      "Cloud Computing Fundamentals",
      "Linux & Networking",
      "Docker",
      "CI/CD",
      "Cloud Deployment",
      "Practical Cloud Projects",
    ];
  } else if (
    category.includes("database") ||
    category.includes("sql")
  ) {
    learningTopics = [
      "Database Fundamentals",
      "SQL Queries",
      "Database Design",
      "Joins & Relationships",
      "Data Manipulation",
      "Database Projects",
    ];
  } else {
    /*
     * Fallback for completely new categories
     * created by the admin.
     *
     * This guarantees that the section
     * will never be empty.
     */
    learningTopics = [
      "Course Fundamentals",
      "Core Concepts",
      "Practical Skills",
      "Tools & Techniques",
      "Hands-on Exercises",
      "Real-world Projects",
    ];
  }

  return (
    <div className="course-details-page">

      {/* ================================
          COURSE HERO
      ================================= */}

      <div className="course-details">

        <div className="course-details-content">

          <span className="course-badge">
            {course.level}
          </span>

          <h1>
            {course.title}
          </h1>

          <p className="course-details-description">
            {course.description}
          </p>

          {/* Course Information */}

          <div className="course-details-info">

            <div>
              <strong>Category</strong>

              <span>
                {course.category}
              </span>
            </div>

            <div>
              <strong>Instructor</strong>

              <span>
                {course.instructor}
              </span>
            </div>

            <div>
              <strong>Duration</strong>

              <span>
                {course.duration}
              </span>
            </div>

            <div>
              <strong>Level</strong>

              <span>
                {course.level}
              </span>
            </div>

          </div>

          {/* Enroll */}

          <button
            className="enroll-btn"
            onClick={handleEnroll}
            disabled={enrolling || enrolled}
          >
            {enrolled
              ? "✓ Already Enrolled"
              : enrolling
              ? "Enrolling..."
              : "Enroll Now"}
          </button>

          {message && (
            <p className="enroll-message">
              {message}
            </p>
          )}

        </div>

      </div>


      {/* ================================
          WHAT YOU'LL LEARN
      ================================= */}

      <section className="course-overview">

        <h2>
          What You'll Learn
        </h2>

        <div className="learning-grid">

          {learningTopics.map(
            (topic, index) => (
              <div key={index}>
                ✓ {topic}
              </div>
            )
          )}

        </div>

        <Link to="/">
          ← Back to Courses
        </Link>

      </section>

    </div>
  );
}

export default CourseDetails;