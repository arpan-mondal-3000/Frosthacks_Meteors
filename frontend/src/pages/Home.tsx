import { Link } from "react-router";
import Button from "../components/Button";
import { useState } from "react";
import { GoogleLogin, CredentialResponse } from "@react-oauth/google";
import { useAuth } from "../contexts/AuthContext";
import { jwtDecode } from "jwt-decode";
import { MessageCircle } from "lucide-react";

function Home() {
  const { isLoggedIn, setIsLoggedIn, setUserDetails } = useAuth();
  // const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [message, setMessage] = useState("");

  const handleLoginSuccess = (response: CredentialResponse) => {
    console.log("Google login successful: ", response);
    if (response.credential) {
      localStorage.setItem("token", response.credential);
      const userDetails: any = jwtDecode(response.credential);
      setUserDetails({
        name: userDetails.name,
        email: userDetails.email,
        profilePic: userDetails.picture,
        exp: userDetails.exp,
        token: response.credential,
      });
    }
    setIsLoggedIn(true);
    console.log(response);
    setMessage("Successfully logged in 🚀");
  };

  const handleGoogleLoginFailure = () => {
    console.log("Google Login Failed!");
    setIsLoggedIn(false);
    setMessage("Google Login failed! Please try again.");
  };

  return (
    <>
      <nav className="absolute z-10 w-full font-primary text-[2rem] font-black justify-between items-center top-0  p-4 border-b-2 border-gray-300">
        <div className="flex gap-3 tracking-wider">
          <div className="split">
            AUSADHI <span className="text-green-600">MITRA</span>
          </div>
        </div>
      </nav>
      

      <div>
        <div className="flex flex-col h-screen items-center justify-center px-4">
          <div className="text-4xl font-extrabold text-center leading-tight max-w-xs">
            <h1>
              Find the{" "}
              <span className="text-white bg-green-600 px-3 py-1 rounded-xl shadow-md">
                right
              </span>{" "}
              <span className="text-white bg-gradient-to-r from-green-500 to-green-700 px-3 py-1 rounded-xl shadow-md">
                medicine
              </span>{" "}
              for you
            </h1>
          </div>
          <div className="mt-6">
            <Link to="/scan">
              <Button title="Scan Prescription" />
            </Link>
          </div>
          {!isLoggedIn && (
            <div className="flex flex-col items-center justify-center bg-white mt-16 p-6 rounded-2xl shadow-lg w-full max-w-sm">
              {/* Login Text */}
              <p className="text-center font-semibold text-lg text-gray-800">
                To save your scan, please sign in with Google
              </p>

              {/* Google Login Button */}
              <div className="my-4">
                <GoogleLogin
                  onSuccess={handleLoginSuccess}
                  onError={handleGoogleLoginFailure}
                />
              </div>
            </div>
          )}
          {message !== "" && (
            <div className="flex flex-col items-center justify-center bg-white mt-16 p-6 rounded-2xl shadow-lg w-full max-w-sm">
              <p
                className={`text-center font-semibold text-lg ${message.includes("Successfully")
                    ? "text-green-500"
                    : "text-red-500"
                  }`}
              >
                {message}
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Home;
