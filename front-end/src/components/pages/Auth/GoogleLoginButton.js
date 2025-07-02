// front-end/src/components/pages/Auth/GoogleLoginButton.js
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_ENDPOINTS, NAME_CONFIG } from '../../../config';

export default function GoogleLoginButton({ setLoading, setLocalError }) {
  const navigate = useNavigate();

  const handleCredentialResponse = async (response) => {
    try {
        
      setLoading(true);
      const idToken = response.credential;
      const res = await axios.post(API_ENDPOINTS.LOGIN_WITH_GOOGLE, { idToken });
      const { user, token } = res.data;

      localStorage.setItem(NAME_CONFIG.USER, JSON.stringify(user));
      localStorage.setItem(NAME_CONFIG.TOKEN, token);

      if (user.isAdmin) {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Google login failed';
      setLocalError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const initGoogleSignIn = () => {
      if (window.google) {
        window.google.accounts.id.initialize({
          client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID,
          callback: handleCredentialResponse
        });

        window.google.accounts.id.renderButton(
          document.getElementById("google-login-button"),
          { theme: "outline", size: "large" }
        );
      }
    };

    if (window.google) {
      initGoogleSignIn();
    } else {
      const interval = setInterval(() => {
        if (window.google) {
          clearInterval(interval);
          initGoogleSignIn();
        }
      }, 200);
      return () => clearInterval(interval);
    }
  }, []);

  return (
    <div id="google-login-button"></div>
  );
}
