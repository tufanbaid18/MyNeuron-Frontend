import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import AuthGlassCard from "../components/auth/AuthGlassCard";
import AuthInput from "../components/auth/AuthInput";
import { APP_ROUTES } from "../constants/app.routes";
import { useLogin } from "../hooks/auth/useLogin";
import { loginSchema, type LoginForm } from "../validations/auth/login";

const LogIn = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const loginMutation = useLogin();

  const onSubmit = (data: LoginForm) => {
    loginMutation.mutate(data);
  };

  return (
    <AuthGlassCard>
      <h2 className="text-center mb-[25px] text-[1.6rem] font-semibold">
        Login
      </h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-[14px]">
          <AuthInput type="email" placeholder="Email" {...register("email")} />
          {errors.email && (
            <p className="text-red-400 text-[12px] mt-[4px]">
              {errors.email.message}
            </p>
          )}
        </div>
        <div className="mb-[14px]">
          <AuthInput
            type="password"
            placeholder="Password"
            {...register("password")}
          />
          {errors.password && (
            <p className="text-red-400 text-[12px] mt-[4px]">
              {errors.password.message}
            </p>
          )}
          <div className="text-right mt-[5px] mb-[5px]">
            <span className="cursor-pointer text-[14px] text-primary hover:underline">
              Forgot Password?
            </span>
          </div>
        </div>

        <button
          type="submit"
          disabled={loginMutation.isPending}
          className="w-full py-[12px] rounded-[8px] text-white text-[1rem] font-medium transition-transform hover:-translate-y-[2px] disabled:opacity-60 disabled:cursor-not-allowed"
          style={{ background: "linear-gradient(90deg, #00c896, #00ff99)" }}
        >
          {loginMutation.isPending ? "Logging in..." : "Log in"}
        </button>
      </form>

      <p className="mt-[15px] text-center text-[0.9rem] text-[#cfe3f0]">
        Don't have an account?{" "}
        <a
          href={APP_ROUTES.REGISTER}
          className="text-primary no-underline hover:underline"
        >
          Register
        </a>
      </p>

      <div className="mt-[15px] text-center text-[0.9rem] text-[#cfe3f0]">
        <label>
          <a
            href={APP_ROUTES.TERMS_AND_CONDITIONS}
            className="text-primary no-underline hover:underline"
          >
            Terms & Conditions
          </a>{" "}
          and{" "}
          <a
            href={APP_ROUTES.PRIVACY_POLICY}
            className="text-primary no-underline hover:underline"
          >
            Privacy Policy
          </a>
          .
        </label>
      </div>
    </AuthGlassCard>
  );
};

export default LogIn;
