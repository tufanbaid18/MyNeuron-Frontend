import React from "react";

const PlatformButton = ({
  disabled = false,
  children,
}: {
  disabled?: boolean;
  children: React.ReactNode;
}) => {
  return (
    <button
      type="submit"
      disabled={disabled}
      className={`w-full py-[10px] rounded-[8px] text-white text-[1rem] font-medium transition-all duration-300 ${
        disabled
          ? "bg-gray-400 cursor-not-allowed text-gray-400"
          : "hover:-translate-y-[2px] hover:shadow-lg active:translate-y-px"
      }`}
      style={
        !disabled
          ? { background: "linear-gradient(90deg, #00c896, #00ff99)" }
          : undefined
      }
    >
      {children}
    </button>
  );
};

export default PlatformButton;
