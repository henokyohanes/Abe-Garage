import React, { useState } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const VerifyCode = () => {
    const [otp, setOtp] = useState("");
    const navigate = useNavigate();

    const handleVerify = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("temp_token");
            const res = await axios.post(
                "/api/login/verify-2fa",
                { otp },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (res.data.status === "success") {
                localStorage.removeItem("temp_token");
                localStorage.setItem("user_token", res.data.token);
                Swal.fire("Success!", "Verification successful", "success");
                navigate("/dashboard");
            } else {
                Swal.fire("Error", "Invalid code", "error");
            }
        } catch (err) {
            Swal.fire("Error", "Verification failed", "error");
        }
    };

    return (
        <form onSubmit={handleVerify}>
            <h3>Enter the 6-digit verification code sent to your email</h3>
            <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter code"
                required
            />
            <button type="submit">Verify</button>
        </form>
    );
};

export default VerifyCode;
