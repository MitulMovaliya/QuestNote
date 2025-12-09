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
import { Mail, ArrowLeft } from "lucide-react";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuthStore from "@/stores/auth.store";

function ResendVerification() {
  const [email, setEmail] = useState<string>("");
  const { isLoading, resendVerificationEmail } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await resendVerificationEmail(email);
    if (result.success && result.email) {
      navigate(PATHS.CHECK_EMAIL, {
        state: { email: result.email, type: "resend" },
      });
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-8 bg-linear-to-br from-accent/10 to-primary/20">
      <div className="max-w-md w-full">
        <form onSubmit={handleSubmit}>
          <Card className="w-full border-2 border-primary/20 rounded-2xl shadow-lg bg-card/70">
            <CardHeader className="space-y-4 pb-6">
              <div className="p-4 rounded-2xl shadow-lg bg-linear-to-br from-primary to-primary/80 mx-auto w-fit">
                <Mail className="w-7 h-7 text-primary-foreground" />
              </div>
              <CardTitle className="text-center text-3xl">
                Resend Verification
              </CardTitle>
              <p className="text-center text-sm text-muted-foreground">
                Enter your email address and we'll send you a new verification
                link.
              </p>
            </CardHeader>

            <CardContent className="space-y-4 px-6">
              <div className="space-y-2">
                <Label className="block font-semibold" htmlFor="email">
                  Email Address
                </Label>
                <div className="relative group">
                  <Mail className="absolute top-3 left-3 w-5 h-5 text-muted-foreground group-focus-within:text-primary" />
                  <Input
                    className="pl-10 h-11"
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
            </CardContent>

            <CardFooter className="px-6 flex-col gap-4">
              <Button
                type="submit"
                className="w-full h-10 hover:bg-primary/80"
                disabled={isLoading}
              >
                {isLoading ? "Sending..." : "Resend Verification Email"}
              </Button>

              <Link
                to={PATHS.LOGIN}
                className="flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Login
              </Link>
            </CardFooter>
          </Card>
        </form>
      </div>
    </div>
  );
}

export default ResendVerification;
