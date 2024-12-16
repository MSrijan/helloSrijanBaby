import { FormEventHandler, useState } from "react";
import heroImg from "../../assets/Authentication/heroImg.jpeg";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Login: React.FC = () => {
  const [values, setValues] = useState({
    mobile_no: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const headers = {
    'Content-Type': 'application/json',
    'Connection': 'close',
    'App-Authorizer': '647061697361',
    'Origin': 'https://silk.billin.space'
  };
  

  // Regex for email validation
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  // Regex for Nepalese phone number validation
  const phoneRegex = /^(984|986|985|980|981|982)\d{7}$/;

  const validateInput = (input: string) => {
    return emailRegex.test(input) || phoneRegex.test(input);
  };

  const handleSubmit: FormEventHandler = (e) => {
    e.preventDefault();

    if (!validateInput(values.mobile_no)) {
      toast.error("Invalid Email or Phone Number");
      return;
    }

    axios
      .post(
        "https://api.billin.space/api/login",
        {
          mobile_no: '9801000000',
          password: 'Silk@2024',
          fcm_token: "no_fcm", // Placeholder for FCM token
        },
        { headers }
      )
      .then((res) => {
        const { access_token, user } = res.data;
        const { name, email } = user;

        if (access_token && user) {
          localStorage.setItem("access_token", access_token);
          localStorage.setItem("name", name || "User");
          localStorage.setItem("email", email || "");

          toast.success("Welcome, you are logged in!", {
            onClose: () => navigate("/"),
          });
        } else {
          throw new Error("Unexpected API response");
        }
      })
      .catch((error) => {
        const errorMessage =
          error.response?.data?.message || error.message || "Unknown error";
        toast.error(`Login failed: ${errorMessage}`);
      });
  };

  return (
    <div className="flex min-h-screen max-h-screen w-full">
      <div className="w-full">
        <img
          src={heroImg}
          alt="HeroImage"
          className="object-cover w-full h-full"
        />
      </div>

      <div className="w-full flex flex-col justify-center items-center">
        <div className="text-center">
          <h1 className="text-heading font-bold">
            <span className="text-red-600">Memory </span>
            <span className="text-yellow-500">Game</span>
          </h1>
          <div className="space-y-4 text-paragraph">
            <h1 className="font-medium mt-10">Sign In To Continue</h1>
            <form
              action=""
              className="flex flex-col gap-4 w-[400px]"
              onSubmit={handleSubmit}
            >
              <input
                type="text"
                placeholder="Email or Phone Number"
                required
                className="p-2 rounded-full px-6 border-2 bg-page-background-color border-gray-300"
                onChange={(e) =>
                  setValues({ ...values, mobile_no: e.target.value })
                }
              />
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  required
                  className="p-2 rounded-full px-6 border-2 bg-page-background-color border-gray-300 w-full"
                  onChange={(e) =>
                    setValues({ ...values, password: e.target.value })
                  }
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-4 top-2/4 transform -translate-y-2/4 text-gray-500"
                >
                  {showPassword ? "👁️" : "🔒"}
                </button>
              </div>
              <button
                className="bg-red-600 hover:bg-opacity-90 duration-300 text-white py-3 rounded-full font-medium hover:shadow-md w-full"
                type="submit"
              >
                Login
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
