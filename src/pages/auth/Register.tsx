import { zodResolver } from "@hookform/resolvers/zod";
import { Checkbox } from "antd";
import { Controller, useForm } from "react-hook-form";
import type { RegisterFormFields } from "../../types/auth/register.types";
import {
  registerSchema,
  type RegisterForm,
} from "../../validations/auth/register";
import { useRegister } from "../../hooks/auth/useRegister";
import AuthGlassCard from "../../components/auth/AuthGlassCard";
import AuthInput from "../../components/auth/AuthInput";
import PlatformButton from "../../components/ui/PlatformButton";
import { APP_ROUTES } from "../../constants/app.routes";

function Register() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    watch,
  } = useForm<RegisterFormFields>({
    resolver: zodResolver(registerSchema),
  });

  const termsAccepted = watch("termsAccepted");

  const registerMutation = useRegister();

  const onSubmit = (data: RegisterForm) => {
    registerMutation.mutate(data);
  };

  return (
    <AuthGlassCard>
      <h2 className="text-center mb-[25px] text-[1.6rem] font-semibold">
        Register
      </h2>

      {/* FIXED */}
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
        <div>
          <AuthInput placeholder="First Name" {...register("first_name")} />
          {errors.first_name && (
            <p className="text-error text-sm">{errors.first_name.message}</p>
          )}
        </div>

        <div>
          <AuthInput placeholder="Middle Name" {...register("middle_name")} />
          {errors.middle_name && (
            <p className="text-error text-sm">{errors.middle_name.message}</p>
          )}
        </div>

        <div>
          <AuthInput placeholder="Last Name" {...register("last_name")} />
          {errors.last_name && (
            <p className="text-error text-sm">{errors.last_name.message}</p>
          )}
        </div>

        <div>
          <AuthInput type="email" placeholder="Email" {...register("email")} />
          {errors.email && (
            <p className="text-error text-sm">{errors.email.message}</p>
          )}
        </div>

        <div>
          <AuthInput
            type="password"
            placeholder="Password"
            {...register("password")}
          />
          {errors.password && (
            <p className="text-error text-sm">{errors.password.message}</p>
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

        <div>
          <Controller
            name="termsAccepted"
            control={control}
            defaultValue={false}
            render={({ field }) => (
              <div className="flex items-center gap-2">
                <Checkbox
                  checked={field.value}
                  onChange={(e) => field.onChange(e.target.checked)}
                />
                <label className="text-[0.9rem]">
                  By creating an account, I agree to the{" "}
                  <a
                    className="text-link font-semibold"
                    href="/Terms&Conditions"
                  >
                    Terms & Conditions
                  </a>{" "}
                  and{" "}
                  <a className="text-link font-semibold" href="/PrivacyPolicy">
                    Privacy Policy
                  </a>
                  .
                </label>
              </div>
            )}
          />

          {errors.termsAccepted && (
            <p className="text-error text-sm">{errors.termsAccepted.message}</p>
          )}
        </div>

        <PlatformButton disabled={registerMutation.isPending || !termsAccepted}>
          {registerMutation.isPending ? "Registering..." : "Register"}
        </PlatformButton>
      </form>

      <p className="text-center text-[0.9rem] text-white mt-5">
        Already have an account?{" "}
        <a
          href={APP_ROUTES.LOGIN}
          className="text-primary no-underline hover:underline"
        >
          Log in
        </a>
      </p>
    </AuthGlassCard>
  );
}

export default Register;
