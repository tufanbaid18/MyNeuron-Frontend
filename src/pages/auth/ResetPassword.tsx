import { zodResolver } from "@hookform/resolvers/zod";
import { getRouteApi } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import AuthGlassCard from "../../components/auth/AuthGlassCard";
import AuthInput from "../../components/auth/AuthInput";
import PlatformButton from "../../components/ui/PlatformButton";
import { APP_ROUTES } from "../../constants/app.routes";
import { useResetPassword } from "../../hooks/auth/useResetPassword";
import type { ResetPasswordPayload } from "../../types/auth/login.types";
import {
  resetPasswordSchema,
  type ResetPasswordSchema,
} from "../../validations/auth/resetPassword";

function ResetPassword() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordSchema>({
    resolver: zodResolver(resetPasswordSchema),
  });
  const routeApi = getRouteApi(APP_ROUTES.RESET_PASSWORD);
  const { token } = routeApi.useSearch();

  const resetPasswordMutation = useResetPassword();

  const onSubmit = (data: ResetPasswordSchema) => {
    const payload: ResetPasswordPayload = {
      token: token,
      new_password: data.new_password,
      confirm_password: data.confirm_password,
    };
    console.log("payload===========>", payload);
    resetPasswordMutation.mutate(payload);
  };

  return (
    <AuthGlassCard>
      <h2 className="text-center mb-[25px] text-[1.6rem] font-semibold">
        Reset Password
      </h2>

      {/* FIXED */}
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
        <div>
          <AuthInput
            type="password"
            placeholder="Password"
            {...register("new_password")}
          />
          {errors.new_password && (
            <p className="text-error text-sm">{errors.new_password.message}</p>
          )}
        </div>

        <div>
          <AuthInput
            type="password"
            placeholder="Confirm Password"
            {...register("confirm_password")}
          />
          {errors.confirm_password && (
            <p className="text-error text-sm">
              {errors.confirm_password.message}
            </p>
          )}
        </div>

        <PlatformButton disabled={resetPasswordMutation.isPending}>
          {resetPasswordMutation.isPending ? "Resetting..." : "Reset Password"}
        </PlatformButton>
      </form>

      <div className="flex flex-col gap-2 mt-5">
        <p className="text-center text-[0.9rem] text-white ">
          Back to{" "}
          <a
            href={APP_ROUTES.LOGIN}
            className="text-primary no-underline font-semibold"
          >
            Login
          </a>
        </p>
        <p className="text-center text-[0.9rem] text-white">
          Token expired?{" "}
          <a
            href={APP_ROUTES.FORGOT_PASSWORD}
            className="text-primary no-underline font-semibold"
          >
            Get new reset link
          </a>
        </p>
      </div>
    </AuthGlassCard>
  );
}

export default ResetPassword;
