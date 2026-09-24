import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function Register() {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const [message, setMessage] = useState("");


  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });

  };


  const handleSubmit = async (e) => {

    e.preventDefault();

    setMessage("");


    if (formData.password !== formData.confirmPassword) {

      setMessage("Passwords do not match.");

      return;
    }


    try {

      const response = await axios.post(
        "http://localhost:5000/api/register",
        {
          name: formData.name,
          email: formData.email,
          password: formData.password
        }
      );


      setMessage(response.data.message);

      setFormData({
        name: "",
        email: "",
        password: "",
        confirmPassword: ""
      });


      setTimeout(() => {
        navigate("/login");
      }, 1500);


    } catch (error) {

      if (error.response) {

        setMessage(error.response.data.message);

      } else {

        setMessage("Unable to connect to the server.");

      }

    }

  };


  return (
    <div className="auth-page">

      <div className="auth-card">

        <div className="auth-icon">
          🎓
        </div>

        <h1>Create Account</h1>

        <p>
          Join CourseHub and start your learning journey.
        </p>


        <form onSubmit={handleSubmit}>

          <label>Full Name</label>

          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter your full name"
            required
          />


          <label>Email Address</label>

          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
            required
          />


          <label>Password</label>

          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Create a password"
            required
          />


          <label>Confirm Password</label>

          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm your password"
            required
          />


          <button type="submit">
            Create Account
          </button>

        </form>


        {message && (
          <p className="auth-message">
            {message}
          </p>
        )}


        <div className="auth-switch">

          <span>Already have an account? </span>

          <Link to="/login">
            Login
          </Link>

        </div>

      </div>

    </div>
  );
}

export default Register;