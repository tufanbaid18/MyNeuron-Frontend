import { useEffect, useRef } from "react";
import { Link } from "@tanstack/react-router";
import AuthGlassCard from "../../components/auth/AuthGlassCard";
import { APP_ROUTES } from "../../constants/app.routes";
import { useVerifyEmailQuery } from "../../hooks/auth/useVerifyEmail";
import { verifyEmailRoute } from "../../routes/auth.routes";
import { Loader2, CheckCircle2, AlertCircle, RefreshCw } from "lucide-react";
import { isAxiosError } from "axios";
import { toast } from "react-hot-toast";

const VerifyEmail = () => {
  const { token } = verifyEmailRoute.useSearch();
  const { 
    isPending, 
    isSuccess, 
    isError, 
    error 
  } = useVerifyEmailQuery(token);

  // Handle side effects (toasts) since onSuccess/onError are removed from useQuery in RC5
  const toastActioned = useRef(false);
  useEffect(() => {
    if (isSuccess && !toastActioned.current) {
      toast.success("Email verified successfully! You can now log in.");
      toastActioned.current = true;
    }
    if (isError && !toastActioned.current) {
      if (isAxiosError(error)) {
        const message = error.response?.data?.message || error.response?.data?.detail || "Failed to verify email.";
        toast.error(message);
      } else if (error instanceof Error) {
        toast.error(error.message);
      }
      toastActioned.current = true;
    }
  }, [isSuccess, isError, error]);

  const isExpired =
    isAxiosError(error) &&
    (error.response?.data?.detail === "Token expired" ||
      error.response?.data?.detail === "Invalid or expired token");

  const buttonStyle = {
    background: "linear-gradient(90deg, #00c896, #00ff99)",
  };

  return (
    <AuthGlassCard>
      <div className="flex flex-col items-center text-center py-5">
        {isPending && (
          <div className="animate-in fade-in duration-500 flex flex-col items-center">
            <Loader2 className="w-16 h-16 text-primary animate-spin mb-6" />
            <h2 className="text-[1.6rem] font-semibold mb-2 text-white">
              Verifying Email
            </h2>
            <p className="text-white/80">
              Please wait while we verify your registered email address.
            </p>
          </div>
        )}

        {isSuccess && (
          <div className="animate-in zoom-in duration-500 flex flex-col items-center w-full">
            <CheckCircle2 className="w-20 h-20 text-[#00ff99] mb-6" />
            <h2 className="text-[1.8rem] font-bold mb-3 text-white">Verified!</h2>
            <p className="text-white/90 mb-8 max-w-[320px]">
              Your email has been successfully verified. You can now access your
              account and explore MyNeuron.
            </p>
            <Link
              to={APP_ROUTES.LOGIN}
              className="w-full py-[14px] rounded-[8px] text-[#001428] text-[1.1rem] font-bold transition-all hover:-translate-y-[2px] active:translate-y-0 text-center shadow-lg hover:shadow-[#00ff9933]"
              style={buttonStyle}
            >
              Continue to Login
            </Link>
          </div>
        )}

        {isError && (
          <div className="animate-in zoom-in duration-500 flex flex-col items-center w-full">
            <AlertCircle className="w-20 h-20 text-red-400 mb-6" />
            <h2 className="text-[1.8rem] font-bold mb-3 text-white">
              {isExpired ? "Link Expired" : "Verification Failed"}
            </h2>
            <p className="text-white/90 mb-8 max-w-[350px]">
              {isExpired
                ? "This verification link has expired. Don’t worry, you can easily request a new one."
                : "We couldn’t verify your email. The link might be invalid or has already been used."}
            </p>
            {isExpired ? (
              <Link
                to={APP_ROUTES.RESEND_EMAIL}
                className="w-full py-[14px] rounded-[8px] text-[#001428] text-[1.1rem] font-bold transition-all hover:-translate-y-[2px] text-center"
                style={buttonStyle}
              >
                <div className="flex items-center justify-center gap-2">
                  <RefreshCw className="w-5 h-5" />
                  Resend Verification Email
                </div>
              </Link>
            ) : (
              <Link
                to={APP_ROUTES.LOGIN}
                className="text-[#00ff99] no-underline font-semibold hover:text-[#00ff99] transition-colors"
              >
                Back to Login
              </Link>
            )}
          </div>
        )}
      </div>
    </AuthGlassCard>
  );
};

export default VerifyEmail;
