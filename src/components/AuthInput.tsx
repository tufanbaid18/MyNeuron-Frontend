import React from "react";

interface AuthInputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const AuthInput: React.FC<AuthInputProps> = ({ className, ...props }) => {
  return (
    <input
      {...props}
      className={`w-full px-[12px] py-[11px] rounded-[8px] bg-[#ffffffe6] text-[0.95rem] text-[#222] border-none outline-none focus:ring-2 focus:ring-[#00ff99] transition-all ${
        className || ""
      }`}
    />
  );
};

export default AuthInput;
