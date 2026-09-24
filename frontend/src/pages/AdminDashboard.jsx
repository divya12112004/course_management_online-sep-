import { useEffect, useState } from "react";
import api from "../axiosConfig";

function AdminDashboard() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  // Admin statistics
  const [stats, setStats] = useState({
    totalCourses: 0,
    totalStudents: 0,
    totalEnrollments: 0,
    completedCourses: 0
  });

  // Course form
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    instructor: "",
    duration: "",
    level: ""
  });

  const [editingId, setEditingId] = useState(null);

  // Enrollment data
  const [enrollments, setEnrollments] = useState([]);

  // Student data
  const [students, setStudents] = useState([]);


  // =========================================
  // FETCH COURSES
  // =========================================

  const fetchCourses = async () => {
    try {
      const response = await api.get(
        "/api/admin/courses",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        }
      );

      setCourses(response.data);
      setLoading(false);

    } catch (error) {
      console.error(
        "Admin courses error:",
        error
      );

      setMessage(
        error.response?.data?.message ||
        "Unable to load courses."
      );

      setLoading(false);
    }
  };


  // =========================================
  // FETCH STATISTICS
  // =========================================

  const fetchStats = async () => {
    try {
      const response = await api.get(
        "/api/admin/stats",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        }
      );

      setStats(response.data);

    } catch (error) {
      console.error(
        "Statistics error:",
        error
      );
    }
  };


  // =========================================
  // FETCH ENROLLMENTS
  // =========================================

  const fetchEnrollments = async () => {
    try {
      const response = await api.get(
        "/api/admin/enrollments",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        }
      );

      setEnrollments(response.data);

    } catch (error) {
      console.error(
        "Enrollment loading error:",
        error
      );
    }
  };


  // =========================================
  // FETCH STUDENTS
  // =========================================

  const fetchStudents = async () => {
    try {
      const response = await api.get(
        "/api/admin/students",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        }
      );

      setStudents(response.data);

    } catch (error) {
      console.error(
        "Student loading error:",
        error
      );
    }
  };


  // =========================================
  // LOAD ADMIN DATA
  // =========================================

  useEffect(() => {
    fetchCourses();
    fetchStats();
    fetchEnrollments();
    fetchStudents();
  }, []);


  // =========================================
  // HANDLE FORM INPUT
  // =========================================

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };


  // =========================================
  // ADD / UPDATE COURSE
  // =========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");

    try {

      if (editingId) {

        await api.put(
          `/api/admin/courses/${editingId}`,
          form,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`
            }
          }
        );

        setMessage(
          "Course updated successfully!"
        );

      } else {

        await api.post(
          "/api/admin/courses",
          form,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`
            }
          }
        );

        setMessage(
          "Course added successfully!"
        );
      }


      // Reset form

      setForm({
        title: "",
        description: "",
        category: "",
        instructor: "",
        duration: "",
        level: ""
      });

      setEditingId(null);


      // Refresh data

      fetchCourses();
      fetchStats();

    } catch (error) {

      console.error(
        "Course save error:",
        error
      );

      setMessage(
        error.response?.data?.message ||
        "Failed to save course."
      );
    }
  };


  // =========================================
  // EDIT COURSE
  // =========================================

  const handleEdit = (course) => {

    setEditingId(course.id);

    setForm({
      title: course.title,
      description: course.description,
      category: course.category,
      instructor: course.instructor,
      duration: course.duration,
      level: course.level
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };


  // =========================================
  // DELETE COURSE
  // =========================================

  const handleDelete = async (id) => {

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this course?"
    );

    if (!confirmDelete) {
      return;
    }

    try {

      await api.delete(
        `/api/admin/courses/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        }
      );

      setMessage(
        "Course deleted successfully!"
      );

      fetchCourses();
      fetchStats();
      fetchEnrollments();

    } catch (error) {

      console.error(
        "Delete course error:",
        error
      );

      setMessage(
        error.response?.data?.message ||
        "Failed to delete course."
      );
    }
  };


  // =========================================
  // CANCEL EDITING
  // =========================================

  const cancelEdit = () => {

    setEditingId(null);

    setForm({
      title: "",
      description: "",
      category: "",
      instructor: "",
      duration: "",
      level: ""
    });
  };


  // =========================================
  // LOADING
  // =========================================

  if (loading) {

    return (
      <div className="admin-page">

        <div className="admin-header">

          <p className="dashboard-tag">
            ADMIN PANEL
          </p>

          <h1>
            Loading...
          </h1>

        </div>

      </div>
    );
  }


  // =========================================
  // ADMIN DASHBOARD
  // =========================================

  return (

    <div className="admin-page">


      {/* =====================================
          HEADER
      ====================================== */}

      <div className="admin-header">

        <p className="dashboard-tag">
          ADMIN PANEL
        </p>

        <h1>
          Course Management
        </h1>

        <p>
          Manage your courses from one place.
        </p>

      </div>


      {/* =====================================
          MESSAGE
      ====================================== */}

      {message && (

        <div className="admin-message">
          {message}
        </div>

      )}


      {/* =====================================
          ADMIN STATISTICS
      ====================================== */}

      <div className="admin-stats">


        <div className="stat-card">

          <div className="stat-icon">
            📚
          </div>

          <div>

            <h3>
              {stats.totalCourses}
            </h3>

            <p>
              Total Courses
            </p>

          </div>

        </div>


        <div className="stat-card">

          <div className="stat-icon">
            👥
          </div>

          <div>

            <h3>
              {stats.totalStudents}
            </h3>

            <p>
              Total Students
            </p>

          </div>

        </div>


        <div className="stat-card">

          <div className="stat-icon">
            📝
          </div>

          <div>

            <h3>
              {stats.totalEnrollments}
            </h3>

            <p>
              Total Enrollments
            </p>

          </div>

        </div>


        <div className="stat-card">

          <div className="stat-icon">
            🎓
          </div>

          <div>

            <h3>
              {stats.completedCourses}
            </h3>

            <p>
              Completed Courses
            </p>

          </div>

        </div>

      </div>


      {/* =====================================
          ADD / EDIT COURSE
      ====================================== */}

      <div className="admin-form-card">

        <h2>

          {editingId
            ? "Edit Course"
            : "Add New Course"}

        </h2>


        <form onSubmit={handleSubmit}>


          <div className="admin-form-grid">


            <input
              type="text"
              name="title"
              placeholder="Course Title"
              value={form.title}
              onChange={handleChange}
              required
            />


            <input
              type="text"
              name="category"
              placeholder="Category"
              value={form.category}
              onChange={handleChange}
              required
            />


            <input
              type="text"
              name="instructor"
              placeholder="Instructor"
              value={form.instructor}
              onChange={handleChange}
              required
            />


            <input
              type="text"
              name="duration"
              placeholder="Duration (e.g. 8 Weeks)"
              value={form.duration}
              onChange={handleChange}
              required
            />


            <select
              name="level"
              value={form.level}
              onChange={handleChange}
              required
            >

              <option value="">
                Select Level
              </option>

              <option value="Beginner">
                Beginner
              </option>

              <option value="Intermediate">
                Intermediate
              </option>

              <option value="Advanced">
                Advanced
              </option>

            </select>


          </div>


          <textarea
            name="description"
            placeholder="Course Description"
            value={form.description}
            onChange={handleChange}
            required
          />


          <div className="admin-form-actions">


            <button
              type="submit"
              className="admin-submit-btn"
            >

              {editingId
                ? "Update Course"
                : "Add Course"}

            </button>


            {editingId && (

              <button
                type="button"
                className="admin-cancel-btn"
                onClick={cancelEdit}
              >
                Cancel
              </button>

            )}


          </div>

        </form>

      </div>


      {/* =====================================
          ALL COURSES
      ====================================== */}

      <div className="admin-course-section">


        <div className="admin-section-title">

          <h2>
            All Courses
          </h2>

          <span>
            {courses.length} Courses
          </span>

        </div>


        <div className="admin-course-grid">


          {courses.map((course) => (

            <div
              className="admin-course-card"
              key={course.id}
            >


              <span className="admin-course-level">
                {course.level}
              </span>


              <h3>
                {course.title}
              </h3>


              <p>
                {course.description}
              </p>


              <div className="admin-course-details">

                <span>
                  📚 {course.category}
                </span>

                <span>
                  👨‍🏫 {course.instructor}
                </span>

                <span>
                  ⏱ {course.duration}
                </span>

              </div>


              <div className="admin-course-actions">


                <button
                  className="edit-course-btn"
                  onClick={() =>
                    handleEdit(course)
                  }
                >
                  ✏️ Edit
                </button>


                <button
                  className="delete-course-btn"
                  onClick={() =>
                    handleDelete(course.id)
                  }
                >
                  🗑️ Delete
                </button>


              </div>


            </div>

          ))}


        </div>

      </div>


      {/* =====================================
          STUDENT ENROLLMENTS
      ====================================== */}

      <div className="admin-enrollment-section">


        <div className="admin-section-title">

          <h2>
            Student Enrollments
          </h2>

          <span>
            {enrollments.length} Enrollments
          </span>

        </div>


        <div className="enrollment-table-wrapper">


          <table className="enrollment-table">


            <thead>

              <tr>

                <th>
                  Student
                </th>

                <th>
                  Email
                </th>

                <th>
                  Course
                </th>

                <th>
                  Enrolled Date
                </th>

                <th>
                  Progress
                </th>

                <th>
                  Status
                </th>

              </tr>

            </thead>


            <tbody>


              {enrollments.length === 0 ? (

                <tr>

                  <td
                    colSpan="6"
                    className="no-enrollments"
                  >
                    No enrollments found.
                  </td>

                </tr>

              ) : (

                enrollments.map(
                  (enrollment) => (

                    <tr
                      key={enrollment.id}
                    >


                      <td>

                        <strong>
                          {enrollment.student_name}
                        </strong>

                      </td>


                      <td>
                        {enrollment.student_email}
                      </td>


                      <td>
                        {enrollment.course_title}
                      </td>


                      <td>

                        {new Date(
                          enrollment.enrolled_at
                        ).toLocaleDateString()}

                      </td>


                      <td>

                        <div className="enrollment-progress">


                          <div className="mini-progress">

                            <div
                              className="mini-progress-fill"
                              style={{
                                width: `${enrollment.percentage}%`
                              }}
                            />

                          </div>


                          <span>
                            {enrollment.percentage}%
                          </span>


                        </div>

                      </td>


                      <td>

                        {enrollment.completed ? (

                          <span className="status-completed">
                            Completed
                          </span>

                        ) : (

                          <span className="status-progress">
                            In Progress
                          </span>

                        )}

                      </td>


                    </tr>

                  )
                )

              )}


            </tbody>

          </table>

        </div>

      </div>


      {/* =====================================
          STUDENT MANAGEMENT
      ====================================== */}

      <div className="admin-student-section">


        <div className="admin-section-title">

          <h2>
            Students
          </h2>

          <span>
            {students.length} Students
          </span>

        </div>


        <div className="student-table-wrapper">


          <table className="student-table">


            <thead>

              <tr>

                <th>
                  Student
                </th>

                <th>
                  Email
                </th>

                <th>
                  Joined Date
                </th>

              </tr>

            </thead>


            <tbody>


              {students.length === 0 ? (

                <tr>

                  <td
                    colSpan="3"
                    className="no-students"
                  >
                    No students found.
                  </td>

                </tr>

              ) : (

                students.map(
                  (student) => (

                    <tr
                      key={student.id}
                    >


                      <td>

                        <div className="student-name-cell">


                          <div className="student-avatar">

                            {student.name
                              .charAt(0)
                              .toUpperCase()}

                          </div>


                          <strong>
                            {student.name}
                          </strong>


                        </div>

                      </td>


                      <td>
                        {student.email}
                      </td>


                      <td>

                        {new Date(
                          student.created_at
                        ).toLocaleDateString()}

                      </td>


                    </tr>

                  )
                )

              )}


            </tbody>

          </table>

        </div>

      </div>


    </div>

  );
}

export default AdminDashboard;