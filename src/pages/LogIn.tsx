import React, { useState } from "react";
import AuthGlassCard from "../components/auth/AuthGlassCard";
import AuthInput from "../components/auth/AuthInput";
import toast from "react-hot-toast";

const LogIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Login attempt", { email, password });
    // TODO: implement logic
  };

  return (
    <AuthGlassCard>
      <h2 className="text-center mb-[25px] text-[1.6rem] font-semibold">
        Login
      </h2>
      <form onSubmit={handleLogin}>
        <div className="mb-[14px]">
          <AuthInput
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="mb-[14px]">
          <AuthInput
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <div className="text-right mt-[5px] mb-[5px]">
            <span className="cursor-pointer text-[14px] text-[#00ff99] hover:underline">
              Forgot Password?
            </span>
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-[12px] rounded-[8px] text-white text-[1rem] font-medium transition-transform hover:-translate-y-[2px]"
          style={{ background: "linear-gradient(90deg, #00c896, #00ff99)" }}
          onClick={() => toast.success("Success")}
        >
          Log in
        </button>
      </form>

      <p className="mt-[15px] text-center text-[0.9rem] text-[#cfe3f0]">
        Don’t have an account?{" "}
        <a
          href="/register"
          className="text-[#00ff99] no-underline hover:underline"
        >
          Register
        </a>
      </p>

      <div className="mt-[15px] text-center text-[0.9rem] text-[#cfe3f0]">
        <label>
          <a
            href="/Terms&Conditions"
            className="text-[#00ff99] no-underline hover:underline"
          >
            Terms & Conditions
          </a>{" "}
          and{" "}
          <a
            href="/PrivacyPolicy"
            className="text-[#00ff99] no-underline hover:underline"
          >
            Privacy Policy
          </a>
          .
        </label>
      </div>
    </AuthGlassCard>
  );
};

export default LogIn;
