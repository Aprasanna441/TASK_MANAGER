import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';
import { NavLink } from "react-router-dom";

const Signup = () => {
  const navigate = useNavigate();
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [serverError, setServerError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false); // To disable button during submission

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Email validation regex
  const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  // Effect to clear errors on field change
  useEffect(() => {
    setEmailError('');
    setPasswordError('');
    setServerError('');
  }, [email, password, confirmPassword]);

  // Handle form submission
  const submitHandler = async (e) => {
    e.preventDefault(); // Prevent default form submission
    setIsSubmitting(true); // Disable the submit button during submission

    // Validate password match
    if (password !== confirmPassword) {
      setPasswordError("**Passwords do not match");
      setIsSubmitting(false);
      return;
    }

    // Password length check
    if (password.length <= 7) {
      setPasswordError("**Password must be at least 8 characters long");
      setIsSubmitting(false);
      return;
    }

    // Validate email format
    if (!validateEmail(email)) {
      setEmailError("**Invalid email format");
      setIsSubmitting(false);
      return;
    }

    // Prepare data for submission
    const actualData = { email, password };

    try {
      const res = await fetch('http://localhost:8000/api/user/signup', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(actualData),
      });

      const result = await res.json();
      if (result.token) {
        setEmailError('');
        setPasswordError('');
        setServerError('');
        localStorage.setItem("token", result.token);
        navigate('/home'); // Redirect to home after successful signup
      } else {
        setServerError(result.message || "An error occurred. Please try again.");
      }
    } catch (error) {
      console.error("Error occurred:", error);
      setServerError("Failed to connect to the server. Please try again.");
    } finally {
      setIsSubmitting(false); // Reset submit state
    }
  };

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-md-4 col-lg-12 bg-secondary">
          <br />
          <h2 className="text-center">Signup</h2>
          <div className="text-warning">
            {passwordError} <br />{emailError} <br />{serverError}
          </div>
          <form id="signupForm" onSubmit={submitHandler} method="POST">
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                className="form-control"
                name="email"
                id="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <br />
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                name="password"
                className="form-control"
                id="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <br />
            <div className="form-group">
              <label htmlFor="password_confirm">Confirm Password</label>
              <input
                type="password"
                name="password_confirm"
                className="form-control"
                id="password_confirm"
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            <br />
            <button type="submit" className="btn btn-primary btn-block" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Signup"}
            </button>
            <p className="text-info">Already Registered? Click Here <NavLink to="/login">Login</NavLink></p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
