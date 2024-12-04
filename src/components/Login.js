import React from "react";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import "./Login.css";

const clientId = "915182832115-5m0mcpeh2sc0fbco11rieskle4oks0d7.apps.googleusercontent.com"; // Replace with your actual Google Client ID.

const Login = ({ onLoginSuccess }) => {
  const handleSuccess = (response) => {
    const profile = JSON.parse(atob(response.credential.split(".")[1]));
    const user = {
      name: profile.name,
      avatar: profile.avatar, // User avatar from Google
    };
    onLoginSuccess(user);
  };

  const handleFailure = (error) => {
    console.error("Login Failed:", error);
    alert("Login failed. Please try again.");
  };

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <div className="login-page">
        <div className="left-section">
          <h1 className="app-title">Task Management App</h1>
          <p className="app-description">
            Streamline your workflow and track progress effortlessly with our task management app.
          </p>
          <div className="login-button">
            <GoogleLogin
              onSuccess={handleSuccess}
              onError={handleFailure}
              text="continue_with"
              theme="outline"
              size="large"
            />
          </div>
        </div>
        <div className="right-section">
          <img
            src="https://uaewebsitedevelopment.com/wp-content/uploads/2022/08/UI-and-UX.jpg"
            alt="Task Management Preview"
            className="preview-image"
          />
        </div>
      </div>
    </GoogleOAuthProvider>
  );
};

export default Login;
