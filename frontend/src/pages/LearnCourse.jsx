import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../axiosConfig";

function LearnCourse() {
  const { id } = useParams();

  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [completedLessons, setCompletedLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  // Load course and existing progress
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setMessage("Please login to access this course.");
      setLoading(false);
      return;
    }

    const loadCourse = async () => {
      try {
        const courseResponse = await api.get("/api/courses");

        const selectedCourse = courseResponse.data.find(
          (item) => item.id === Number(id)
        );

        if (!selectedCourse) {
          setMessage("Course not found.");
          setLoading(false);
          return;
        }

        setCourse(selectedCourse);

        // Set lessons based on category
        const category =
          selectedCourse.category?.trim().toLowerCase() || "";

        let courseLessons = [];

        if (
          category.includes("web") ||
          category.includes("frontend") ||
          category.includes("full stack")
        ) {
          courseLessons = [
            "HTML & CSS",
            "JavaScript",
            "React.js",
            "Responsive Design",
            "API Integration",
            "Real-world Project"
          ];
        } else if (
          category.includes("programming") ||
          category.includes("python") ||
          category.includes("java")
        ) {
          courseLessons = [
            "Programming Fundamentals",
            "Variables & Data Types",
            "Functions",
            "Object-Oriented Programming",
            "File Handling",
            "Programming Project"
          ];
        } else if (
          category.includes("data") ||
          category.includes("analytics")
        ) {
          courseLessons = [
            "Excel Fundamentals",
            "SQL Basics",
            "Python for Data Analysis",
            "Data Cleaning",
            "Power BI",
            "Analytics Project"
          ];
        } else if (
          category.includes("machine learning") ||
          category.includes("artificial intelligence") ||
          category.includes("ai")
        ) {
          courseLessons = [
            "AI & ML Introduction",
            "Python for Machine Learning",
            "Data Preparation",
            "Machine Learning Models",
            "Model Evaluation",
            "AI Project"
          ];
        } else if (
          category.includes("cloud") ||
          category.includes("devops")
        ) {
          courseLessons = [
            "Cloud Fundamentals",
            "Cloud Services",
            "Virtualization",
            "Containers & Docker",
            "CI/CD",
            "Cloud Project"
          ];
        } else if (
          category.includes("database") ||
          category.includes("sql")
        ) {
          courseLessons = [
            "Database Fundamentals",
            "SQL Basics",
            "Database Design",
            "Queries & Joins",
            "Advanced SQL",
            "Database Project"
          ];
        } else {
          courseLessons = [
            "Introduction",
            "Fundamentals",
            "Core Concepts",
            "Practical Exercises",
            "Advanced Topics",
            "Final Project"
          ];
        }

        setLessons(courseLessons);

        // Get enrolled courses and existing progress
        const progressResponse = await api.get(
          "/api/my-courses",
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        const enrolledCourse = progressResponse.data.find(
          (item) => item.id === Number(id)
        );

        if (!enrolledCourse) {
          setMessage(
            "You are not enrolled in this course."
          );
          setLoading(false);
          return;
        }

        // Restore progress
        const savedPercentage = Number(
          enrolledCourse.percentage || 0
        );

        if (savedPercentage > 0) {
          const completedCount = Math.round(
            (savedPercentage / 100) *
              courseLessons.length
          );

          const restoredLessons = [];

          for (let i = 0; i < completedCount; i++) {
            restoredLessons.push(i);
          }

          setCompletedLessons(restoredLessons);
        }

        setLoading(false);

      } catch (error) {
        console.error(
          "Course loading error:",
          error
        );

        setMessage(
          error.response?.data?.message ||
            "Unable to load course."
        );

        setLoading(false);
      }
    };

    loadCourse();
  }, [id]);


  // Calculate percentage
  const percentage =
    lessons.length > 0
      ? Math.round(
          (completedLessons.length /
            lessons.length) *
            100
        )
      : 0;


  // Save progress
  const saveProgress = async (newCompletedLessons) => {
    const token = localStorage.getItem("token");

    if (!token) {
      setMessage("Please login first.");
      return;
    }

    const newPercentage =
      lessons.length > 0
        ? Math.round(
            (newCompletedLessons.length /
              lessons.length) *
              100
          )
        : 0;

    setSaving(true);

    try {
      await api.put(
        "/api/progress",
        {
          courseId: Number(id),
          percentage: newPercentage
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setMessage(
        newPercentage === 100
          ? "🎉 Course completed!"
          : "Progress saved successfully!"
      );

    } catch (error) {
      console.error(
        "Progress save error:",
        error
      );

      setMessage(
        error.response?.data?.message ||
          "Failed to save progress."
      );

    } finally {
      setSaving(false);
    }
  };


  // Toggle lesson
  const toggleLesson = (index) => {
    let updatedLessons;

    if (completedLessons.includes(index)) {
      updatedLessons = completedLessons.filter(
        (item) => item !== index
      );
    } else {
      updatedLessons = [
        ...completedLessons,
        index
      ];
    }

    setCompletedLessons(updatedLessons);

    saveProgress(updatedLessons);
  };


  // Loading
  if (loading) {
    return (
      <div className="learning-page">
        <div className="learning-loading">

          <div className="learning-spinner"></div>

          <p>Loading your course...</p>

        </div>
      </div>
    );
  }


  // Course not found
  if (!course) {
    return (
      <div className="learning-page">

        <div className="learning-error">

          <div className="learning-error-icon">
            📚
          </div>

          <h1>
            Course Not Found
          </h1>

          <p>
            {message}
          </p>

          <Link to="/dashboard">
            ← Back to My Courses
          </Link>

        </div>

      </div>
    );
  }


  return (
    <div className="learning-page">

      {/* Top navigation */}

      <div className="learning-topbar">

        <Link
          to="/dashboard"
          className="learning-back"
        >
          ← My Courses
        </Link>

        <span className="learning-course-status">
          {percentage === 100
            ? "✓ Completed"
            : "● In Progress"}
        </span>

      </div>


      {/* Course Hero */}

      <div className="learning-hero">

        <div className="learning-hero-content">

          <p className="learning-tag">
            COURSE LEARNING
          </p>

          <h1>
            {course.title}
          </h1>

          <p className="learning-description">
            {course.description}
          </p>

          <div className="learning-meta">

            <span>
              📚 {course.category}
            </span>

            <span>
              🎯 {course.level}
            </span>

            <span>
              ⏱ {course.duration}
            </span>

            <span>
              👨‍🏫 {course.instructor}
            </span>

          </div>

        </div>

      </div>


      {/* Main content */}

      <div className="learning-container">

        {/* Progress card */}

        <div className="learning-progress-card">

          <div className="learning-progress-top">

            <div>

              <p>
                YOUR PROGRESS
              </p>

              <h2>
                {percentage === 100
                  ? "Course Completed 🎉"
                  : "Keep going!"}
              </h2>

            </div>

            <div className="learning-progress-circle">
              <strong>
                {percentage}%
              </strong>

              <span>
                Complete
              </span>
            </div>

          </div>


          <div className="learning-progress-track">

            <div
              className="learning-progress-fill"
              style={{
                width: `${percentage}%`
              }}
            />

          </div>


          <div className="learning-progress-footer">

            <span>
              {completedLessons.length} of{" "}
              {lessons.length} lessons completed
            </span>

            {saving && (
              <span className="saving-progress">
                Saving...
              </span>
            )}

          </div>

        </div>


        {/* Message */}

        {message && (
          <div
            className={`learning-message ${
              percentage === 100
                ? "success"
                : ""
            }`}
          >
            {message}
          </div>
        )}


        {/* Lessons */}

        <div className="lesson-section">

          <div className="lesson-heading">

            <div>
              <p className="learning-tag">
                LEARNING PATH
              </p>

              <h2>
                Course Lessons
              </h2>

              <p>
                Complete each lesson to track
                your learning progress.
              </p>
            </div>

            <div className="lesson-count">
              {completedLessons.length}
              <span>
                / {lessons.length}
              </span>
            </div>

          </div>


          <div className="lesson-list">

            {lessons.map(
              (lesson, index) => {

                const completed =
                  completedLessons.includes(
                    index
                  );

                return (
                  <button
                    className={`lesson-item ${
                      completed
                        ? "completed"
                        : ""
                    }`}
                    key={index}
                    onClick={() =>
                      toggleLesson(index)
                    }
                  >

                    <div className="lesson-number">

                      {completed
                        ? "✓"
                        : index + 1}

                    </div>


                    <div className="lesson-content">

                      <span className="lesson-label">
                        LESSON {index + 1}
                      </span>

                      <h3>
                        {lesson}
                      </h3>

                      <span className="lesson-status">
                        {completed
                          ? "Completed"
                          : "Click to mark as completed"}
                      </span>

                    </div>


                    <div className="lesson-arrow">
                      {completed
                        ? "✓"
                        : "→"}
                    </div>

                  </button>
                );
              }
            )}

          </div>

        </div>

      </div>

    </div>
  );
}

export default LearnCourse;