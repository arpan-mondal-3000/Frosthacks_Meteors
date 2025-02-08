import { Download } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useEffect, useState } from "react";
import { CredentialResponse, GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { get_history } from "../api";

function Profile() {
  const { isLoggedIn, setIsLoggedIn, setUserDetails, userDetails } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [historyData, setHistoryData] = useState<any>([]);
  const [historyError, setHistoryError] = useState("");

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
  };

  const handleGoogleLoginFailure = () => {
    console.log("Google Login Failed!");
    setIsLoggedIn(false);
  };
  // const data = {
  //   history: [
  //     {
  //       img: "https://images.pexels.com/photos/29090361/pexels-photo-29090361/free-photo-of-autumn-birch-forest-with-golden-leaves.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  //       date: "2021-09-01",
  //       download: "https://www.google.com",
  //     },
  //     {
  //       img: "https://images.pexels.com/photos/29090361/pexels-photo-29090361/free-photo-of-autumn-birch-forest-with-golden-leaves.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  //       date: "2021-09-01",
  //       download: "https://www.google.com",
  //     },
  //   ],
  // };

  const handleLogout = () => {
    setIsLoading(true);

    new Promise((resolve) => {
      setTimeout(() => {
        resolve("resolved");
      }, 500);
    }).then(() => {
      setIsLoading(false);
      setIsLoggedIn(false);
      setUserDetails(null);
      localStorage.removeItem("token");
    });
  };

  useEffect(() => {
    const handleHistory = async () => {
      if (isLoggedIn && userDetails) {
        try {
          const data = await get_history(userDetails.token);
          setHistoryData(data.history);
          console.log(data);
        } catch (err) {
          console.error("History data could not be fetched: ", err);
          setHistoryError("Your history could not be fetched!");
        }
      }
    };
    if (isLoggedIn && userDetails) {
      handleHistory();
    }
  }, [isLoggedIn]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
        <div className="bg-white p-8 rounded-xl shadow-lg flex flex-col items-center gap-4 w-full max-w-md text-center">
          <h1 className="text-2xl font-bold text-gray-900">Logging Out...</h1>
          <p className="text-gray-600">Please wait while we log you out.</p>
        </div>
      </div>
    );
  } else if (!isLoggedIn)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
        <div className="bg-white p-8 rounded-xl shadow-lg flex flex-col items-center gap-4 w-full max-w-md text-center">
          <h1 className="text-2xl font-bold text-gray-900">
            🔒 Please Login to View Profile
          </h1>
          <p className="text-gray-600">
            Access to your profile is restricted. Please log in to continue.
          </p>
          <div className="mt-2  text-white font-medium rounded-lg shadow-md transition-all">
            <GoogleLogin
              onSuccess={handleLoginSuccess}
              onError={handleGoogleLoginFailure}
            />
          </div>
        </div>
      </div>
    );
  else
    return (
      <div className="min-h-screen bg-gray-100 p-6">
        {/* Profile Card */}
        <div className="bg-white p-6 rounded-xl shadow-lg flex sm:flex-row items-center gap-6 w-full max-w-md sm:max-w-lg lg:max-w-2xl">
          {/* User Image */}
          <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full overflow-hidden outline-1 outline-offset-2">
            <img
              src={userDetails?.profilePic}
              alt="User"
              className="w-full h-full object-cover"
            />
          </div>

          {/* User Details */}
          <div className="text-center sm:text-left">
            <h2 className="text-2xl font-bold text-gray-900">
              {userDetails?.name}
            </h2>
            <p className="text-gray-600">
              📧<strong>Email</strong>: {userDetails?.email}
            </p>

            {/* Hoverable Edit Button */}
            <button
              className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg shadow-md hover:bg-red-600 transition-all"
              onClick={handleLogout}
            >
              Log out
            </button>
          </div>
        </div>
        {/* History */}
        <div className="mt-6">
          <h1 className="font-black text-3xl">History</h1>
          {historyError !== "" && (
            <div className="text-center py-2 text-red-500">{historyError}</div>
          )}
          {historyData.length !== 0 ? (
            <div className="grid grid-cols-1 gap-3 mt-10">
              {historyData.map((medicine: any, index: any) => (
                <div
                  key={index}
                  className="bg-white p-4 rounded-xl shadow-lg flex items-center gap-4"
                >
                  <img
                    src={`data:image/png;base64, ${medicine.image}`}
                    alt="Prescription"
                    className="w-24 h-24 object-cover rounded-lg border"
                  />

                  {/* Prescription Details */}
                  <div className="flex-1">
                    <h2 className="text-lg font-bold text-gray-900">
                      Prescription
                    </h2>
                    <p className="text-gray-600 text-sm">
                      📅 <strong>Date</strong>:
                    </p>
                  </div>

                  {/* Download Button */}
                  {/* <a
                  href={medicine.download}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-2 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700 transition-all text-sm"
                >
                  <Download />
                </a> */}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center">You have not scanned anything yet</div>
          )}
          <div className="bg-white flex rounded-lg shadow-lg p-6 justify-center mb-20 mt-10">
            Hope You Will Get Soon 😊
          </div>
        </div>
      </div>
    );
}

export default Profile;
