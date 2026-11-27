import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import API_URL from "../api";

function GoogleAuthButton({ onError }) {
  const navigate = useNavigate();

  const handleSuccess = async (credentialResponse) => {
    try {
      const response = await fetch(`${API_URL}/api/auth/google`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ credential: credentialResponse.credential }),
      });
      const data = await response.json();

      if (!response.ok) {
        onError(data.message || "Google login failed");
        return;
      }

      localStorage.setItem("token", data.token);
      navigate("/");
    } catch {
      onError("Google login ke dauran server se connect nahi ho paya.");
    }
  };

  return (
    <GoogleLogin
      onSuccess={handleSuccess}
      onError={() => onError("Google authentication cancel ya fail ho gaya.")}
      width="320"
    />
  );
}

export default GoogleAuthButton;
