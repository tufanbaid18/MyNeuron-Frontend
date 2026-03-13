import { Outlet, useNavigate } from "@tanstack/react-router";
import { APP_ROUTES } from "../constants/app.routes";

const AuthLayout = () => {
  const navigate = useNavigate();
  if (window.location.pathname === APP_ROUTES.AUTH) {
    navigate({ to: APP_ROUTES.LOGIN });
  }

  return (
    <div
      className="min-h-screen w-full bg-cover bg-center bg-no-repeat relative flex items-center px-[5%] md:px-[8%] py-[60px] flex-col md:flex-row gap-10 md:gap-0 font-sans"
      style={{ backgroundImage: `url('/auth_bg.jpg')` }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-[#001428a6] z-1"></div>

      {/* Left side text container */}
      <div className="relative z-2 text-white w-full max-w-[1000px] max-h-[800px] text-center md:text-left mx-auto md:mx-0">
        <img
          src="/logo.png"
          alt="MyNeuron Logo"
          className="w-full max-w-[420px] md:max-w-[450px] h-auto mx-auto md:mx-0 mb-[20px]"
        />

        <h1 className="text-[1.3rem] md:text-[2.4rem] font-bold text-[#70a83e] mb-[18px] leading-[1.3]">
          Connect | Collaborate | Create
        </h1>

        <p className="text-[1rem] md:text-[1.2rem] text-[#f1f1f1] leading-[1.7] mb-[20px]">
          Connecting bright minds to advance health research & innovation
        </p>

        <div className="flex flex-wrap gap-4 font-semibold justify-center md:justify-start">
          <a
            href={APP_ROUTES.EVENTS_INFO}
            className="text-white hover:text-[#70a83e] transition-colors"
          >
            Events
          </a>
          <a
            href={APP_ROUTES.CONSULTANCY_INFO}
            className="text-white hover:text-[#70a83e] transition-colors"
          >
            Consultancy
          </a>
          <a
            href={APP_ROUTES.PRODUCTS_INFO}
            className="text-white hover:text-[#70a83e] transition-colors"
          >
            Products
          </a>
        </div>
      </div>

      {/* Right Form Outlet */}
      <div className="relative z-2 w-full max-w-[420px] md:max-w-[520px] mx-auto md:ml-auto md:mr-0 pl-0 md:pl-5">
        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout;
