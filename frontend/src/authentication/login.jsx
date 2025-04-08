import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'; // Ensure Bootstrap is included
import { useNavigate } from 'react-router-dom';
import { NavLink } from "react-router-dom";
import { useState } from 'react';

const Login = () => {
  const navigate = useNavigate();
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [serverError, setServerError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false); // To disable button during submission

  // Email validation regex
  const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  // Handle form submission
  const submitHandler = async (e) => {
    e.preventDefault(); // Prevent submission without completion
    setIsSubmitting(true); // Buffering element
  
    const data = new FormData(e.currentTarget);
    const email = data.get("email");
    const password = data.get("password");
   
  
    // Password length check
    if (password.length <= 7) {
      setPasswordError("**Password must be at least 8 characters long");
      setIsSubmitting(false); 
    } else {
      // Validate email
      if (validateEmail(email)) {
        const actualData = { email, password };
  
        try {
          const res = await fetch("http://localhost:8000/api/user/login", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(actualData),
          });
  
          const result = await res.json();
          if (result.token) {
            setEmailError("");
            setPasswordError("");
            setServerError("");
            localStorage.setItem("token", result.token);
            navigate('/home'); // Redirect to home after successful signup
          } else {
            setServerError(result.message || "An error occurred. Please try again.");
          }
        } catch (error) {
          console.error("Error occurred:", error);
          setServerError("Failed to connect to the server. Please try again.");
        } finally {
          setIsSubmitting(false); 
        }
      } else {
        setEmailError("**Invalid email format");
        setIsSubmitting(false); 
      }
    }
  };
  return (

    <div class="container ">
      <div class="row justify-content-center">
        <div class="col-md-4 col-lg-12 bg-secondary">
          <br />
          <h2 class="text-center">Login</h2>
          <form id="LoginForm" onSubmit={submitHandler}>
          {passwordError} <br />{emailError} <br />{serverError}
            <div class="form-group">
              <label for="email">Email</label>
              <input type="text" class="form-control" id="email" name='email' placeholder="Enter email" required />
            </div> <br />
            <div class="form-group">
              <label for="password" >Password</label>
              <input type="password" class="form-control" name='password' id="password" placeholder="Enter password" required />
            </div><br />
            <button type="submit" className="btn btn-primary btn-block" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Login"}
            </button>
            <p className='text-info'>Signup Instead? Click Here<NavLink to="/signup">Signup</NavLink></p>
          </form>
        </div>
      </div>
    </div>






  );
}

export default Login;
