import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../axiosConfig";

function Login() {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: ""
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


    try {

     const response = await api.post(
  "/api/login",
  {
          email: formData.email,
          password: formData.password
        }
      );


      localStorage.setItem(
        "token",
        response.data.token
      );

      localStorage.setItem(
        "user",
        JSON.stringify(response.data.user)
      );


      setMessage(response.data.message);


      setTimeout(() => {
        navigate("/");
      }, 1000);


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

        <h1>Welcome Back</h1>

        <p>
          Login to continue learning with CourseHub.
        </p>


        <form onSubmit={handleSubmit}>

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
            placeholder="Enter your password"
            required
          />


          <div className="forgot-password">

            <a href="#">
              Forgot password?
            </a>

          </div>


          <button type="submit">
            Login
          </button>

        </form>


        {message && (
          <p className="auth-message">
            {message}
          </p>
        )}


        <div className="auth-switch">

          <span>
            Don't have an account?{" "}
          </span>

          <Link to="/register">
            Create Account
          </Link>

        </div>

      </div>

    </div>
  );
}

export default Login;