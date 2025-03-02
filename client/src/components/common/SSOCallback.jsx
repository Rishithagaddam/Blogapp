import { useEffect } from "react";
import { useClerk, useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";

export default function SSOCallback() {
  const { handleRedirectCallback } = useClerk();
  const { user, isLoaded } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoaded) return;

    handleRedirectCallback().then(() => {
      // Navigate to home page first
      navigate("/");
    });
  }, [handleRedirectCallback, navigate, isLoaded]);

  return <div>Loading...</div>;
}

const AuthBackground = () => (
  <div className="auth-background">
    <div className="auth-pattern"></div>
    <span className="auth-doodle">✎</span>
    <span className="auth-doodle">♥</span>
    <span className="auth-doodle">✿</span>
  </div>
);
