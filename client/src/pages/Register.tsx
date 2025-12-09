import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PATHS } from "@/config/paths";
import useAuthStore from "@/stores/auth.store";
import { LockKeyhole, Mail, User, UserPlus } from "lucide-react";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

function Register() {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const { register, isLoading } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters!");
      return;
    }

    const result = await register({ name, email, password });
    if (result.success && result.email) {
      navigate(PATHS.CHECK_EMAIL, {
        state: { email: result.email, type: "verification" },
      });
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-8 bg-linear-to-br from-accent/10 to-primary/20">
      <div className="max-w-md w-full">
        <form onSubmit={handleSubmit}>
          <Card className="w-full border-2 border-primary/20 rounded-2xl shadow-lg bg-card/70">
            <CardHeader className="space-y-2 pb-6">
              <div className="p-3 rounded-2xl shadow-md bg-primary mx-auto">
                <UserPlus className="w-7 h-7" />
              </div>
              <CardTitle className="text-center text-3xl">
                Create Account
              </CardTitle>
              <p className="text-center text-sm text-muted-foreground">
                Sign up to get started with your account
              </p>
            </CardHeader>
            <CardContent className="space-y-4 px-6">
              <div className="space-y-2">
                <Label className="block font-semibold" htmlFor="name">
                  Full Name
                </Label>
                <div className="relative group">
                  <User className="absolute top-3 left-3 w-5 h-5 text-muted-foreground group-focus-within:text-primary" />
                  <Input
                    className="pl-10 h-11 bg-accent/60!"
                    id="name"
                    type="text"
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    autoComplete="name"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="block font-semibold" htmlFor="email">
                  Email Address
                </Label>
                <div className="relative group">
                  <Mail className="absolute top-3 left-3 w-5 h-5 text-muted-foreground group-focus-within:text-primary" />
                  <Input
                    className="pl-10 h-11 bg-accent/60!"
                    id="email"
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="block font-semibold" htmlFor="password">
                  Password
                </Label>
                <div className="relative group">
                  <LockKeyhole className="absolute top-3 left-3 w-5 h-5 text-muted-foreground group-focus-within:text-primary" />
                  <Input
                    className="pl-10 h-11 bg-accent/60!"
                    id="password"
                    type="password"
                    placeholder="Create a password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="new-password"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label
                  className="block font-semibold"
                  htmlFor="confirmPassword"
                >
                  Confirm Password
                </Label>
                <div className="relative group">
                  <LockKeyhole className="absolute top-3 left-3 w-5 h-5 text-muted-foreground group-focus-within:text-primary" />
                  <Input
                    className="pl-10 h-11 bg-accent/60!"
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    autoComplete="new-password"
                    required
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="px-6">
              <Button
                type="submit"
                className="w-full h-10 hover:bg-primary/80"
                disabled={isLoading}
              >
                {isLoading ? "Creating Account..." : "Create Account"}
              </Button>
            </CardFooter>
            <CardFooter className="px-6">
              <div className="relative w-full flex items-center justify-center">
                <div className="border-b-2 w-full"></div>
                <div className="absolute inset-0 mx-auto flex px-2 bg-card w-fit items-center text-sm">
                  Or
                </div>
              </div>
            </CardFooter>
            <CardFooter className="px-6 pb-6">
              <div className="flex flex-col gap-4 w-full">
                <Button
                  variant="outline"
                  type="button"
                  className="w-full h-10 bg-accent/60! hover:bg-accent/80!"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="2443"
                    height="2500"
                    preserveAspectRatio="xMidYMid"
                    viewBox="0 0 256 262"
                    id="google"
                    className="w-5 h-5 mr-2"
                  >
                    <path
                      fill="#4285F4"
                      d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622 38.755 30.023 2.685.268c24.659-22.774 38.875-56.282 38.875-96.027"
                    ></path>
                    <path
                      fill="#34A853"
                      d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055-34.523 0-63.824-22.773-74.269-54.25l-1.531.13-40.298 31.187-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1"
                    ></path>
                    <path
                      fill="#FBBC05"
                      d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82 0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602l42.356-32.782"
                    ></path>
                    <path
                      fill="#EA4335"
                      d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0 79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251"
                    ></path>
                  </svg>
                  Sign up with Google
                </Button>
                <p className="text-center text-sm text-muted-foreground">
                  Already have an account?{" "}
                  <Link
                    to={PATHS.LOGIN}
                    className="text-primary hover:underline font-semibold"
                  >
                    Sign in
                  </Link>
                </p>
              </div>
            </CardFooter>
          </Card>
        </form>
      </div>
    </div>
  );
}

export default Register;
