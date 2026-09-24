import "./App.css";
import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import CourseCard from "./components/CourseCard";
import About from "./components/About";
import Footer from "./components/Footer";

import Login from "./pages/Login";
import Register from "./pages/Register";
import CourseDetails from "./pages/CourseDetails";
import Profile from "./pages/Profile";
import Dashboard from "./pages/Dashboard";

import { Routes, Route } from "react-router-dom";
import LearnCourse from "./pages/LearnCourse";
import AdminDashboard from "./pages/AdminDashboard";


function Home() {

  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);

  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [level, setLevel] = useState("All Levels");
  const [category, setCategory] = useState("All Categories");


  // Fetch courses
  useEffect(() => {

    axios
      .get("http://localhost:5000/api/courses")

      .then((response) => {

        setCourses(response.data);
        setFilteredCourses(response.data);

        setLoading(false);

      })

      .catch((error) => {

        console.error(
          "Error fetching courses:",
          error
        );

        setLoading(false);

      });

  }, []);


  // Search and filter courses
  useEffect(() => {

    let result = courses;


    // Search
    if (search.trim() !== "") {

      result = result.filter((course) =>

        course.title
          .toLowerCase()
          .includes(search.toLowerCase())

        ||

        course.description
          .toLowerCase()
          .includes(search.toLowerCase())

        ||

        course.category
          .toLowerCase()
          .includes(search.toLowerCase())

      );

    }


    // Level filter
    if (level !== "All Levels") {

      result = result.filter(
        (course) => course.level === level
      );

    }


    // Category filter
    if (category !== "All Categories") {

      result = result.filter(
        (course) => course.category === category
      );

    }


    setFilteredCourses(result);

  }, [search, level, category, courses]);


  return (

    <>

      <Navbar />

      <Hero />


      {/* Courses Section */}

      <section
        className="courses"
        id="courses"
      >

        <h2>
          Popular Courses
        </h2>


        <p className="courses-subtitle">
          Explore our courses and start learning today.
        </p>


        {/* Search and Filters */}

        <div className="course-filters">

          <input
            type="text"
            placeholder="🔍 Search courses..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />


          <select
            value={level}
            onChange={(e) =>
              setLevel(e.target.value)
            }
          >

            <option>
              All Levels
            </option>

            <option>
              Beginner
            </option>

            <option>
              Intermediate
            </option>

            <option>
              Advanced
            </option>

          </select>


          <select
            value={category}
            onChange={(e) =>
              setCategory(e.target.value)
            }
          >

            <option>
              All Categories
            </option>

            <option>
              Web Development
            </option>

            <option>
              Programming
            </option>

            <option>
              Data Analytics
            </option>

          </select>

        </div>


        {/* Course List */}

        {loading ? (

          <p className="course-status">
            Loading courses...
          </p>

        ) : filteredCourses.length === 0 ? (

          <div className="no-courses">

            <h3>
              No courses found
            </h3>

            <p>
              Try changing your search or filters.
            </p>

          </div>

        ) : (

          <div className="course-container">

            {filteredCourses.map(
              (course) => (

                <CourseCard

                  key={course.id}

                  id={course.id}

                  title={course.title}

                  description={
                    course.description
                  }

                  level={course.level}

                  duration={
                    course.duration
                  }

                />

              )
            )}

          </div>

        )}

      </section>


      <About />

      <Footer />

    </>

  );

}
function AdminRoute() {
  const token = localStorage.getItem("token");
  const user = JSON.parse(
    localStorage.getItem("user") || "null"
  );

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (!user || user.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return <AdminDashboard />;
}


function App() {

  return (

    <Routes>

      <Route
        path="/"
        element={<Home />}
      />

      <Route
        path="/login"
        element={<Login />}
      />

      <Route
        path="/register"
        element={<Register />}
      />

      <Route
        path="/course-details/:id"
        element={<CourseDetails />}
      />

      <Route
        path="/profile"
        element={<Profile />}
      />

      <Route
        path="/dashboard"
        element={<Dashboard />}
      />

      <Route
  path="/learn/:id"
  element={<LearnCourse />}
/>

<Route
  path="/admin"
  element={<AdminRoute />}
/>

    </Routes>

  );

}


export default App;