import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import AuthGlassCard from "../../components/auth/AuthGlassCard";
import AuthInput from "../../components/auth/AuthInput";
import { APP_ROUTES } from "../../constants/app.routes";
import { useForgotPassword } from "../../hooks/auth/useForgotPassword";
import type { EmailForm } from "../../validations/auth/verify";
import { emailSchema } from "../../validations/auth/verify";

const ForgotPassword = () => {
  const {
    register: data,
    handleSubmit,
    formState: { errors },
  } = useForm<EmailForm>({
    resolver: zodResolver(emailSchema),
  });

  const forgotPasswordMutaion = useForgotPassword();

  const onSubmit = async (data: EmailForm) => {
    console.log(data);
    forgotPasswordMutaion.mutate({ email: data.email });
  };

  return (
    <AuthGlassCard>
      <h2 className="text-center mb-[25px] text-[1.6rem] font-semibold">
        Forgot Password
      </h2>
      <p className="text-center mb-[25px] text-[0.9rem] text-white">
        Enter your registered email address, and we'll send you a link to reset
        your password.
      </p>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-[14px]">
          <AuthInput
            type="email"
            placeholder="Enter your registered email"
            {...data("email")}
          />
          {errors.email && (
            <p className="text-error text-sm font-semibold mt-1">
              {errors.email.message}
            </p>
          )}
        </div>
        <button
          type="submit"
          className="w-full py-[12px] rounded-[8px] text-white text-[1rem] font-medium transition-transform hover:-translate-y-[2px]"
          style={{ background: "linear-gradient(90deg, #00c896, #00ff99)" }}
          disabled={forgotPasswordMutaion.isPending}
        >
          {forgotPasswordMutaion.isPending ? "Sending..." : "Send Reset Link"}
        </button>
        <p className="text-center text-[0.9rem] text-white mt-5">
          Back to{" "}
          <a
            href={APP_ROUTES.LOGIN}
            className="text-primary no-underline font-semibold"
          >
            Login
          </a>
        </p>
      </form>
    </AuthGlassCard>
  );
};

export default ForgotPassword;
