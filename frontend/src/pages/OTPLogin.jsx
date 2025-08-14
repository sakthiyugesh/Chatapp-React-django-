import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function OTPLogin() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1);

  const navigate = useNavigate();

  const sendOtp = async () => {
    await axios.post("http://127.0.0.1:8000/api/send-otp/", { email });
    setStep(2);
  };

  const verifyOtp = async () => {
    const res = await axios.post("http://127.0.0.1:8000/api/verify-otp/", {
      email,
      otp,
    });
    const { access, refresh, user } = res.data;

    // ⚠️ More secure: store refresh in httpOnly cookie (set by backend)
    localStorage.setItem("access", access);
    localStorage.setItem("refresh", refresh);
    // localStorage.setItem("user", JSON.stringify(user));

    axios.defaults.headers.common["Authorization"] = `Bearer ${access}`;
    // alert("Logged in!");
    window.location.reload('')
    // console.log(res.data.user)
  };

  return (
    <div className="login_container">
      <div className="con">
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Distinctio
          deleniti quasi molestias reiciendis quas?
        </p>
        <div>
          {step === 1 && (
            <>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <button onClick={sendOtp}>Send OTP</button>
            </>
          )}
          {step === 2 && (
            <>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
              <button className="btn_verify_otp" onClick={verifyOtp}>
                Verify OTP
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
