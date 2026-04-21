import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import AuthGlassCard from "../../components/auth/AuthGlassCard";
import AuthInput from "../../components/auth/AuthInput";
import { APP_ROUTES } from "../../constants/app.routes";
import { useResendVerificationEmail } from "../../hooks/auth/useVerifyEmail";
import type { EmailForm } from "../../validations/auth/verify";
import { emailSchema } from "../../validations/auth/verify";

const VerificationMail = () => {
  const {
    register: data,
    handleSubmit,
    formState: { errors },
  } = useForm<EmailForm>({
    resolver: zodResolver(emailSchema),
  });

  const verifyEmailMutation = useResendVerificationEmail();

  const onSubmit = async (data: EmailForm) => {
    verifyEmailMutation.mutate({ email: data.email });
  };

  return (
    <AuthGlassCard>
      <h2 className="text-center mb-[10px] text-[1.6rem] font-semibold ">
        Resend Verification Email
      </h2>
      <p className="text-center mb-[25px] text-[0.9rem] text-white">
        We’ve sent a verification email to your registered address. If it
        expired or you didn’t receive it, enter your email to resend.
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
          disabled={verifyEmailMutation.isPending}
        >
          {verifyEmailMutation.isPending ? "Resending..." : "Resend Email"}
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

export default VerificationMail;
