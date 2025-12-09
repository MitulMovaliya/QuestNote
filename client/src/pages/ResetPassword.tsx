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
import { LockKeyhole } from "lucide-react";
import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import useAuthStore from "@/stores/auth.store";

function ResetPassword() {
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [searchParams] = useSearchParams();
  const { isLoading, resetPassword } = useAuthStore();
  const navigate = useNavigate();

  const token = searchParams.get("token");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) {
      toast.error("Invalid reset token!");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters!");
      return;
    }

    const result = await resetPassword(token, password);
    if (result.success) {
      navigate(PATHS.LOGIN);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-8 bg-linear-to-br from-accent/10 to-primary/20">
      <div className="max-w-md w-full">
        <form onSubmit={handleSubmit}>
          <Card className="w-full border-2 border-primary/20 rounded-2xl shadow-lg bg-card/70">
            <CardHeader className="space-y-4 pb-6">
              <div className="p-4 rounded-2xl shadow-lg bg-linear-to-br from-primary to-primary/80 mx-auto w-fit">
                <LockKeyhole className="w-7 h-7 text-primary-foreground" />
              </div>
              <CardTitle className="text-center text-3xl">
                Reset Password
              </CardTitle>
              <p className="text-center text-sm text-muted-foreground">
                Enter your new password below
              </p>
            </CardHeader>

            <CardContent className="space-y-4 px-6">
              <div className="space-y-2">
                <Label className="block font-semibold" htmlFor="password">
                  New Password
                </Label>
                <div className="relative group">
                  <LockKeyhole className="absolute top-3 left-3 w-5 h-5 text-muted-foreground group-focus-within:text-primary" />
                  <Input
                    className="pl-10 h-11"
                    id="password"
                    type="password"
                    placeholder="Enter new password"
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
                    className="pl-10 h-11"
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    autoComplete="new-password"
                    required
                  />
                </div>
              </div>

              <div className="bg-accent/20 border border-border rounded-lg p-3">
                <p className="text-xs text-muted-foreground">
                  Password must be at least 6 characters long
                </p>
              </div>
            </CardContent>

            <CardFooter className="px-6">
              <Button
                type="submit"
                className="w-full h-10 hover:bg-primary/80"
                disabled={isLoading}
              >
                {isLoading ? "Resetting..." : "Reset Password"}
              </Button>
            </CardFooter>
          </Card>
        </form>
      </div>
    </div>
  );
}

export default ResetPassword;
