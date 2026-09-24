require("dotenv").config();
const express = require("express");
const cors = require("cors");
const db = require("./db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const verifyToken = require("./middleware/auth");
const verifyAdmin = require("./middleware/admin");
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET;

const app = express();

// Middleware
app.use(cors({
  origin: "http://localhost:5173"
}));

app.use(express.json());


// Home API
app.get("/", (req, res) => {
  res.json({
    message: "Course Management API is running!"
  });
});


// Get all courses from MySQL
app.get("/api/courses", (req, res) => {

  const sql = "SELECT * FROM courses";

  db.query(sql, (err, results) => {

    if (err) {
      console.error("Error fetching courses:", err);

      return res.status(500).json({
        message: "Failed to fetch courses"
      });
    }

    res.json(results);
  });

});

app.get("/api/db-test", (req, res) => {

  db.query("SELECT 1 AS connected", (err, result) => {

    if (err) {
      return res.status(500).json({
        connected: false,
        message: "MySQL connection failed",
        error: err.message
      });
    }

    res.json({
      connected: true,
      message: "MySQL connected successfully!",
      result: result
    });

  });

});

// Register API
app.post("/api/register", async (req, res) => {

  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({
      message: "Please fill in all fields"
    });
  }

  try {

    const hashedPassword = await bcrypt.hash(password, 10);

    const sql = `
      INSERT INTO users (name, email, password)
      VALUES (?, ?, ?)
    `;

    db.query(
      sql,
      [name, email, hashedPassword],
      (err, result) => {

        if (err) {

          if (err.code === "ER_DUP_ENTRY") {
            return res.status(409).json({
              message: "Email already registered"
            });
          }

          console.error("Registration error:", err);

          return res.status(500).json({
            message: "Registration failed"
          });
        }

        res.status(201).json({
          message: "Registration successful!",
          userId: result.insertId
        });

      }
    );

  } catch (error) {

    console.error("Password hashing error:", error);

    res.status(500).json({
      message: "Registration failed"
    });

  }

});

// Login API
app.post("/api/login", (req, res) => {

  const email = req.body.email?.trim().toLowerCase();
  const password = req.body.password;

  if (!email || !password) {
    return res.status(400).json({
      message: "Email and password are required"
    });
  }

  // Get the user's role directly from MySQL
  const sql = `
    SELECT id, name, email, password, role
    FROM users
    WHERE LOWER(TRIM(email)) = ?
    LIMIT 1
  `;

  db.query(sql, [email], async (err, results) => {

    if (err) {
      console.error("Login error:", err);

      return res.status(500).json({
        message: "Login failed"
      });
    }

    if (results.length === 0) {
      return res.status(401).json({
        message: "Invalid email or password"
      });
    }

    const user = results[0];

    const passwordMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!passwordMatch) {
      return res.status(401).json({
        message: "Invalid email or password"
      });
    }

    // Check what role was received from MySQL
    console.log(
      `Login successful: ${user.email} | role: ${user.role}`
    );

    // Create JWT token
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role
      },
      JWT_SECRET,
      {
        expiresIn: "1h"
      }
    );

    // Send login response
    res.json({
      message: "Login successful!",
      token: token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  });

});
// Protected Profile API
app.get("/api/profile", verifyToken, (req, res) => {

  const userId = req.user.id;

  const sql = `
    SELECT id, name, email, role, created_at
    FROM users
    WHERE id = ?
  `;

  db.query(sql, [userId], (err, results) => {

    if (err) {
      console.error("Profile error:", err);

      return res.status(500).json({
        message: "Failed to fetch profile"
      });
    }

    if (results.length === 0) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    res.json({
      user: results[0]
    });

  });

});

// Enroll in a course
app.post("/api/enroll", verifyToken, (req, res) => {

  const userId = req.user.id;
  const { courseId } = req.body;

  if (!courseId) {
    return res.status(400).json({
      message: "Course ID is required"
    });
  }

  const sql = `
    INSERT INTO enrollments (user_id, course_id)
    VALUES (?, ?)
  `;

  db.query(
    sql,
    [userId, courseId],
    (err, result) => {

      if (err) {

        if (err.code === "ER_DUP_ENTRY") {
          return res.status(409).json({
            message: "You are already enrolled in this course"
          });
        }

        console.error("Enrollment error:", err);

        return res.status(500).json({
          message: "Failed to enroll in course"
        });
      }

      res.status(201).json({
        message: "Successfully enrolled in the course!",
        enrollmentId: result.insertId
      });

    }
  );

});

// Get courses enrolled by logged-in student with progress
app.get("/api/my-courses", verifyToken, (req, res) => {

  const userId = req.user.id;

  const sql = `
    SELECT
      courses.id,
      courses.title,
      courses.description,
      courses.category,
      courses.instructor,
      courses.duration,
      courses.level,
      enrollments.enrolled_at,
      COALESCE(progress.percentage, 0) AS percentage,
      COALESCE(progress.completed, 0) AS completed
    FROM enrollments

    INNER JOIN courses
      ON enrollments.course_id = courses.id

    LEFT JOIN progress
      ON progress.course_id = courses.id
      AND progress.user_id = enrollments.user_id

    WHERE enrollments.user_id = ?

    ORDER BY enrollments.enrolled_at DESC
  `;

  db.query(sql, [userId], (err, results) => {

    if (err) {

      console.error("My courses error:", err);

      return res.status(500).json({
        message: "Failed to fetch enrolled courses"
      });

    }

    res.json(results);

  });

});
// Update course progress
app.put("/api/progress", verifyToken, (req, res) => {

  const userId = req.user.id;
  const { courseId, percentage } = req.body;

  if (!courseId || percentage === undefined) {
    return res.status(400).json({
      message: "Course ID and percentage are required"
    });
  }

  if (percentage < 0 || percentage > 100) {
    return res.status(400).json({
      message: "Percentage must be between 0 and 100"
    });
  }

  const completed = percentage === 100;

  const sql = `
    INSERT INTO progress
      (user_id, course_id, percentage, completed)
    VALUES (?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE
      percentage = VALUES(percentage),
      completed = VALUES(completed),
      last_accessed = CURRENT_TIMESTAMP
  `;

  db.query(
    sql,
    [userId, courseId, percentage, completed],
    (err, result) => {

      if (err) {
        console.error("Progress error:", err);

        return res.status(500).json({
          message: "Failed to update progress"
        });
      }

      res.json({
        message: "Progress updated successfully!",
        percentage: percentage,
        completed: completed
      });

    }
  );

});

// ================================
// ADMIN COURSE MANAGEMENT
// ================================

// Get all courses - Admin only
app.get(
  "/api/admin/courses",
  verifyToken,
  verifyAdmin,
  (req, res) => {
    const sql = "SELECT * FROM courses ORDER BY id DESC";

    db.query(sql, (err, results) => {
      if (err) {
        console.error("Admin courses error:", err);
        return res.status(500).json({
          message: "Failed to fetch courses"
        });
      }

      res.json(results);
    });
  }
);


// Add course - Admin only
app.post(
  "/api/admin/courses",
  verifyToken,
  verifyAdmin,
  (req, res) => {
    const {
      title,
      description,
      category,
      instructor,
      duration,
      level
    } = req.body;

    if (
      !title ||
      !description ||
      !category ||
      !instructor ||
      !duration ||
      !level
    ) {
      return res.status(400).json({
        message: "Please fill in all course fields."
      });
    }

    const sql = `
      INSERT INTO courses
      (title, description, category, instructor, duration, level)
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    db.query(
      sql,
      [
        title,
        description,
        category,
        instructor,
        duration,
        level
      ],
      (err, result) => {
        if (err) {
          console.error("Add course error:", err);
          return res.status(500).json({
            message: "Failed to add course"
          });
        }

        res.status(201).json({
          message: "Course added successfully!",
          courseId: result.insertId
        });
      }
    );
  }
);


// Update course - Admin only
app.put(
  "/api/admin/courses/:id",
  verifyToken,
  verifyAdmin,
  (req, res) => {
    const { id } = req.params;

    const {
      title,
      description,
      category,
      instructor,
      duration,
      level
    } = req.body;

    if (
      !title ||
      !description ||
      !category ||
      !instructor ||
      !duration ||
      !level
    ) {
      return res.status(400).json({
        message: "Please fill in all course fields."
      });
    }

    const sql = `
      UPDATE courses
      SET
        title = ?,
        description = ?,
        category = ?,
        instructor = ?,
        duration = ?,
        level = ?
      WHERE id = ?
    `;

    db.query(
      sql,
      [
        title,
        description,
        category,
        instructor,
        duration,
        level,
        id
      ],
      (err, result) => {
        if (err) {
          console.error("Update course error:", err);
          return res.status(500).json({
            message: "Failed to update course"
          });
        }

        if (result.affectedRows === 0) {
          return res.status(404).json({
            message: "Course not found"
          });
        }

        res.json({
          message: "Course updated successfully!"
        });
      }
    );
  }
);


// Delete course - Admin only
app.delete(
  "/api/admin/courses/:id",
  verifyToken,
  verifyAdmin,
  (req, res) => {
    const { id } = req.params;

    const sql = `
      DELETE FROM courses
      WHERE id = ?
    `;

    db.query(
      sql,
      [id],
      (err, result) => {
        if (err) {
          console.error("Delete course error:", err);
          return res.status(500).json({
            message: "Failed to delete course"
          });
        }

        if (result.affectedRows === 0) {
          return res.status(404).json({
            message: "Course not found"
          });
        }

        res.json({
          message: "Course deleted successfully!"
        });
      }
    );
  }
);

// ================================
// ADMIN DASHBOARD STATISTICS
// ================================

app.get(
  "/api/admin/stats",
  verifyToken,
  verifyAdmin,
  (req, res) => {

    const sql = `
      SELECT
        (SELECT COUNT(*) FROM courses) AS totalCourses,
        (SELECT COUNT(*) FROM users WHERE role = 'student') AS totalStudents,
        (SELECT COUNT(*) FROM enrollments) AS totalEnrollments,
        (SELECT COUNT(*)
         FROM progress
         WHERE completed = TRUE) AS completedCourses
    `;

    db.query(sql, (err, results) => {

      if (err) {
        console.error(
          "Admin statistics error:",
          err
        );

        return res.status(500).json({
          message: "Failed to fetch statistics"
        });
      }

      res.json(results[0]);

    });
  }
);

// ================================
// ADMIN ENROLLMENT MANAGEMENT
// ================================

app.get(
  "/api/admin/enrollments",
  verifyToken,
  verifyAdmin,
  (req, res) => {

    const sql = `
      SELECT
        enrollments.id,
        users.name AS student_name,
        users.email AS student_email,
        courses.title AS course_title,
        enrollments.enrolled_at,
        COALESCE(progress.percentage, 0) AS percentage,
        COALESCE(progress.completed, 0) AS completed
      FROM enrollments
      INNER JOIN users
        ON enrollments.user_id = users.id
      INNER JOIN courses
        ON enrollments.course_id = courses.id
      LEFT JOIN progress
        ON enrollments.user_id = progress.user_id
        AND enrollments.course_id = progress.course_id
      ORDER BY enrollments.enrolled_at DESC
    `;

    db.query(sql, (err, results) => {

      if (err) {
        console.error(
          "Admin enrollment error:",
          err
        );

        return res.status(500).json({
          message: "Failed to fetch enrollments"
        });
      }

      res.json(results);
    });
  }
);

// ================================
// ADMIN STUDENT MANAGEMENT
// ================================

app.get(
  "/api/admin/students",
  verifyToken,
  verifyAdmin,
  (req, res) => {
    const sql = `
      SELECT
        id,
        name,
        email,
        created_at
      FROM users
      WHERE role = 'student'
      ORDER BY created_at DESC
    `;

    db.query(sql, (err, results) => {
      if (err) {
        console.error(
          "Admin students error:",
          err
        );

        return res.status(500).json({
          message: "Failed to fetch students"
        });
      }

      res.json(results);
    });
  }
);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});