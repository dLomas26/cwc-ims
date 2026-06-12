import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "../../../store/AuthContext";
import { useNavigate, Navigate } from "react-router";
import { useState } from "react";
import Button from "../../../components/ui/Button";

const schema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

const LoginPage = () => {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
  });

  if (isAuthenticated) return <Navigate to="/dashboard" replace />;

  const onSubmit = async (data) => {
    setServerError("");
    try {
      await login(data.email, data.password);
      navigate("/dashboard");
    } catch (err) {
      setServerError(err.response?.data?.message || "Invalid credentials");
    }
  };

  return (
    <div className="w-full min-h-screen bg-linear-to-br from-slate-50 via-indigo-50/30 to-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <img
            src="/cwc-about.png"
            alt="CWC logo"
            className="mx-auto w-14 h-14 rounded-2xl object-cover mb-4 shadow-lg shadow-red-200"
          />
          <h1 className="text-2xl font-bold text-slate-800">CWC Inventory</h1>
          <p className="text-sm text-slate-500 mt-1">Sign in to your account</p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xl shadow-slate-200/50 p-8">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            {serverError && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-red-50 border border-red-100 text-red-600 text-sm">
                <svg
                  className="w-4 h-4 shrink-0"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
                </svg>
                {serverError}
              </div>
            )}

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-slate-700">
                Email
              </label>
              <input
                {...register("email")}
                type="email"
                placeholder="you@company.com"
                autoComplete="email"
                className={[
                  "h-10 px-3 rounded-lg border text-sm outline-none transition-all",
                  "focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400",
                  errors.email
                    ? "border-red-300"
                    : "border-slate-200 hover:border-slate-300",
                ].join(" ")}
              />
              {errors.email && (
                <p className="text-xs text-red-500">{errors.email.message}</p>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-slate-700">
                Password
              </label>
              <input
                {...register("password")}
                type="password"
                placeholder="••••••••"
                autoComplete="current-password"
                className={[
                  "h-10 px-3 rounded-lg border text-sm outline-none transition-all",
                  "focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400",
                  errors.password
                    ? "border-red-300"
                    : "border-slate-200 hover:border-slate-300",
                ].join(" ")}
              />
              {errors.password && (
                <p className="text-xs text-red-500">
                  {errors.password.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              loading={isSubmitting}
              size="lg"
              className="w-full mt-2"
            >
              Sign In
            </Button>
          </form>

          <p className="text-center text-xs text-slate-400 mt-5">
            First time setup?{" "}
            <a href="/setup" className="text-indigo-600 hover:underline">
              Create admin account
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
