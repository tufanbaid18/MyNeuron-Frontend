import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import AuthGlassCard from "../components/auth/AuthGlassCard";
import AuthInput from "../components/auth/AuthInput";
import { useVerifyEmail } from "../hooks/auth/useVerifyEmail";
import type { VerifyForm } from "../validations/auth/verify";
import { verifySchema } from "../validations/auth/verify";

const VerificationMail = () => {
  const {
    register: data,
    handleSubmit,
    formState: { errors },
  } = useForm<VerifyForm>({
    resolver: zodResolver(verifySchema),
  });

  const verifyEmailMutation = useVerifyEmail();

  const onSubmit = async (data: VerifyForm) => {
    console.log(data);
    verifyEmailMutation.mutate({ email: data.email });
  };

  return (
    <AuthGlassCard>
      <h2 className="text-center mb-[25px] text-[1.6rem] font-semibold">
        Resend Verification Email
      </h2>
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
      </form>
    </AuthGlassCard>
  );
};

export default VerificationMail;
