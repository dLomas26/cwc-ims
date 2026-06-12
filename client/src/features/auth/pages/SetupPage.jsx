import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "react-router";
import api from "../../../lib/axios";
import Button from "../../../components/ui/Button";

const schema = z.object({
  full_name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

const SetupPage = () => {
  const navigate = useNavigate();
  const [serverError, setServerError] = useState("");
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data) => {
    setServerError("");
    try {
      await api.post("/auth/setup", data);
      setSuccess(true);
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setServerError(
        err.response?.data?.message ||
          "Setup failed. Admin account may already exist."
      );
    }
  };

  return (
    <div className="w-full min-h-screen bg-linear-to-br from-slate-50 via-indigo-50/30 to-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <img
            src="/cwc-about.png"
            alt="CWC logo"
            className="mx-auto w-14 h-14 rounded-2xl object-cover mb-4 shadow-lg shadow-red-200"
          />
          <h1 className="text-2xl font-bold text-slate-800">Initial Setup</h1>
          <p className="text-sm text-slate-500 mt-1">
            Create the first Super Admin account
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-xl shadow-slate-200/50 p-8">
          {success ? (
            <div className="text-center py-4">
              <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-3">
                <svg
                  className="w-6 h-6 text-emerald-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <p className="text-sm font-medium text-slate-700">
                Admin account created!
              </p>
              <p className="text-xs text-slate-500 mt-1">
                Redirecting to login...
              </p>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col gap-4"
            >
              {serverError && (
                <div className="p-3 rounded-lg bg-red-50 border border-red-100 text-red-600 text-sm">
                  {serverError}
                </div>
              )}

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700">
                  Full Name
                </label>
                <input
                  {...register("full_name")}
                  placeholder="Admin Name"
                  className="h-10 px-3 rounded-lg border border-slate-200 text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400"
                />
                {errors.full_name && (
                  <p className="text-xs text-red-500">
                    {errors.full_name.message}
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700">
                  Email
                </label>
                <input
                  {...register("email")}
                  type="email"
                  placeholder="admin@company.com"
                  className="h-10 px-3 rounded-lg border border-slate-200 text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400"
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
                  className="h-10 px-3 rounded-lg border border-slate-200 text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400"
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
                Create Admin Account
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default SetupPage;
