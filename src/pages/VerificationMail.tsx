import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import AuthGlassCard from "../components/auth/AuthGlassCard";
import AuthInput from "../components/auth/AuthInput";
import type { VerifyForm } from "../validations/auth/verify";
import { verifySchema } from "../validations/auth/verify";

const VerificationMail = () => {
  const {
    register: data,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<VerifyForm>({
    resolver: zodResolver(verifySchema),
  });

  const onSubmit = async (data: VerifyForm) => {
    try {
      console.log(data);

      // await api.verify(data)

      toast.success("Verification email sent");
    } catch (error) {
      toast.error("Verification email failed");
    }
  };
  return (
    <AuthGlassCard>
      <h2 className="text-center mb-[25px] text-[1.6rem] font-semibold">
        Resend Verification Email
      </h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-[14px]">
          <AuthInput type="email" placeholder="Email" {...data("email")} />
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
          disabled={isSubmitting}
        >
          {isSubmitting ? "Resending..." : "Resend Email"}
        </button>
      </form>
    </AuthGlassCard>
  );
};

export default VerificationMail;
