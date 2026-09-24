import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../axiosConfig";

function Dashboard() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setMessage("Please login to view your dashboard.");
      setLoading(false);
      return;
    }

    api
      .get("/api/my-courses", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then((response) => {
        setCourses(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Dashboard error:", error);

        if (error.response?.status !== 401) {
          setMessage(
            error.response?.data?.message ||
              "Unable to load your courses."
          );
        }

        setLoading(false);
      });
  }, []);

  const updateProgress = async (courseId, percentage) => {
    const token = localStorage.getItem("token");

    if (!token) {
      setMessage("Please login first.");
      return;
    }

    try {
      await api.put(
        "/api/progress",
        {
          courseId,
          percentage
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setCourses((currentCourses) =>
        currentCourses.map((course) =>
          course.id === courseId
            ? {
                ...course,
                percentage,
                completed: percentage === 100 ? 1 : 0
              }
            : course
        )
      );

      setMessage("");
    } catch (error) {
      console.error("Progress update error:", error);

      if (error.response?.status !== 401) {
        setMessage(
          error.response?.data?.message ||
            "Failed to update progress."
        );
      }
    }
  };

  /* ================================
     LOADING
  ================================= */

  if (loading) {
    return (
      <div className="dashboard-page">

        <div className="dashboard-loading">

          <div className="loading-circle"></div>

          <p>Loading your learning dashboard...</p>

        </div>

      </div>
    );
  }

  /* ================================
     STATISTICS
  ================================= */

  const totalCourses = courses.length;

  const completedCourses = courses.filter(
    (course) => Number(course.percentage) === 100
  ).length;

  const averageProgress =
    totalCourses > 0
      ? Math.round(
          courses.reduce(
            (total, course) =>
              total + Number(course.percentage || 0),
            0
          ) / totalCourses
        )
      : 0;

  return (
    <div className="dashboard-page">

      {/* ================================
          HEADER
      ================================= */}

      <div className="dashboard-header">

        <p className="dashboard-tag">
          MY LEARNING
        </p>

        <h1>
          Welcome Back 👋
        </h1>

        <p>
          Continue learning and keep building your skills.
        </p>

      </div>


      {/* ================================
          LEARNING STATS
      ================================= */}

      <div className="dashboard-stats">

        <div className="dashboard-stat-card">

          <div className="stat-icon">
            🎓
          </div>

          <div>
            <span>Enrolled Courses</span>
            <strong>{totalCourses}</strong>
          </div>

        </div>


        <div className="dashboard-stat-card">

          <div className="stat-icon">
            📈
          </div>

          <div>
            <span>Average Progress</span>
            <strong>{averageProgress}%</strong>
          </div>

        </div>


        <div className="dashboard-stat-card">

          <div className="stat-icon">
            🏆
          </div>

          <div>
            <span>Completed</span>
            <strong>{completedCourses}</strong>
          </div>

        </div>

      </div>


      {/* ================================
          MESSAGE
      ================================= */}

      {message && (
        <div className="dashboard-message">
          {message}
        </div>
      )}


      {/* ================================
          EMPTY STATE
      ================================= */}

      {!message && courses.length === 0 && (

        <div className="empty-courses">

          <div className="empty-icon">
            📚
          </div>

          <h2>
            Start Your Learning Journey
          </h2>

          <p>
            You haven't enrolled in any courses yet.
            Explore our courses and start learning today.
          </p>

          <Link to="/">
            Explore Courses →
          </Link>

        </div>

      )}


      {/* ================================
          COURSES
      ================================= */}

      {courses.length > 0 && (

        <div className="dashboard-section">

          <div className="dashboard-section-heading">

            <div>
              <p>YOUR COURSES</p>

              <h2>
                Continue Learning
              </h2>
            </div>

            <Link to="/">
              Browse Courses →
            </Link>

          </div>


          <div className="dashboard-course-grid">

            {courses.map((course) => {

              const percentage =
                Number(course.percentage || 0);

              const isCompleted =
                percentage === 100;

              return (

                <div
                  className={`dashboard-course-card ${
                    isCompleted
                      ? "course-completed"
                      : ""
                  }`}
                  key={course.id}
                >

                  {/* Course top */}

                  <div className="dashboard-card-top">

                    <span className="course-level">
                      {course.level}
                    </span>

                    {isCompleted && (
                      <span className="completed-badge">
                        ✓ Completed
                      </span>
                    )}

                  </div>


                  {/* Course title */}

                  <h2>
                    {course.title}
                  </h2>


                  <p className="dashboard-course-description">
                    {course.description}
                  </p>


                  {/* Course information */}

                  <div className="dashboard-course-info">

                    <span>
                      📚 {course.category}
                    </span>

                    <span>
                      ⏱ {course.duration}
                    </span>

                  </div>


                  {/* Progress */}

                  <div className="progress-section">

                    <div className="progress-header">

                      <span>
                        Your Progress
                      </span>

                      <strong>
                        {percentage}%
                      </strong>

                    </div>


                    <div className="progress-bar">

                      <div
                        className="progress-fill"
                        style={{
                          width: `${percentage}%`
                        }}
                      />

                    </div>

                  </div>


                  {/* Continue */}

                  <Link
                    to={`/learn/${course.id}`}
                    className="continue-learning-btn"
                  >
                    {isCompleted
                      ? "Review Course"
                      : "Continue Learning"}

                    <span>→</span>

                  </Link>


                  {/* Progress controls */}

                  <div className="progress-actions">

                    <button
                      className={
                        percentage >= 25
                          ? "active"
                          : ""
                      }
                      onClick={() =>
                        updateProgress(
                          course.id,
                          25
                        )
                      }
                    >
                      25%
                    </button>

                    <button
                      className={
                        percentage >= 50
                          ? "active"
                          : ""
                      }
                      onClick={() =>
                        updateProgress(
                          course.id,
                          50
                        )
                      }
                    >
                      50%
                    </button>

                    <button
                      className={
                        percentage >= 75
                          ? "active"
                          : ""
                      }
                      onClick={() =>
                        updateProgress(
                          course.id,
                          75
                        )
                      }
                    >
                      75%
                    </button>

                    <button
                      className={
                        percentage === 100
                          ? "active complete"
                          : ""
                      }
                      onClick={() =>
                        updateProgress(
                          course.id,
                          100
                        )
                      }
                    >
                      ✓
                    </button>

                  </div>

                </div>

              );
            })}

          </div>

        </div>

      )}

    </div>
  );
}

export default Dashboard;