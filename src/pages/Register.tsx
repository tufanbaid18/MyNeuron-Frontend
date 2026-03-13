import { zodResolver } from "@hookform/resolvers/zod";
import { Checkbox } from "antd";
import { useForm, Controller } from "react-hook-form";
import toast from "react-hot-toast";
import AuthGlassCard from "../components/auth/AuthGlassCard";
import AuthInput from "../components/auth/AuthInput";
import { APP_ROUTES } from "../constants/app.routes";
import type { RegisterFormFields } from "../types/auth/register.types";
import { registerSchema } from "../validations/auth/register";
import PlatformButton from "../components/ui/PlatformButton";

function Register() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    control,
    watch,
  } = useForm<RegisterFormFields>({
    resolver: zodResolver(registerSchema),
  });

  const termsAccepted = watch("termsAccepted");

  const onSubmit = async (data: RegisterFormFields) => {
    try {
      console.log(data);

      // await api.register(data)

      toast.success("Account created");

      // navigate(APP_ROUTES.LOGIN);
    } catch (error) {
      toast.error("Registration failed");
    }
  };

  return (
    <AuthGlassCard>
      <h2 className="text-center mb-[25px] text-[1.6rem] font-semibold">
        Register
      </h2>

      {/* FIXED */}
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
        <div>
          <AuthInput placeholder="First Name" {...register("firstName")} />
          {errors.firstName && (
            <p className="text-error text-sm">{errors.firstName.message}</p>
          )}
        </div>

        <div>
          <AuthInput placeholder="Middle Name" {...register("middleName")} />
          {errors.middleName && (
            <p className="text-error text-sm">{errors.middleName.message}</p>
          )}
        </div>

        <div>
          <AuthInput placeholder="Last Name" {...register("lastName")} />
          {errors.lastName && (
            <p className="text-error text-sm">{errors.lastName.message}</p>
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
            {...register("confirmPassword")}
          />
          {errors.confirmPassword && (
            <p className="text-error text-sm">
              {errors.confirmPassword.message}
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

        <PlatformButton disabled={isSubmitting || !termsAccepted}>
          {isSubmitting ? "Registering..." : "Register"}
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
