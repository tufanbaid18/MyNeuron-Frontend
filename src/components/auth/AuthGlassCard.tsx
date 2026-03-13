import React from 'react';

interface AuthGlassCardProps {
  children: React.ReactNode;
}

const AuthGlassCard = ({ children }: AuthGlassCardProps) => {
  return (
    <div className="relative z-2 w-full max-w-[520px] bg-[#ffffff1f] border border-white/25 rounded-[20px] px-[35px] py-[40px] backdrop-blur-[20px] shadow-[0_10px_25px_#0000004d] text-white">
      {children}
    </div>
  );
};

export default AuthGlassCard;
