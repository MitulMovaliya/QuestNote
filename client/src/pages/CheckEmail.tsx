import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PATHS } from "@/config/paths";
import { Mail, CheckCircle2 } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

function CheckEmail() {
  const location = useLocation();
  const email = location.state?.email || "";
  const type = location.state?.type || "verification"; // verification, reset, resend

  const getTitle = () => {
    switch (type) {
      case "reset":
        return "Password Reset Email Sent";
      case "resend":
        return "Verification Email Sent";
      default:
        return "Check Your Email";
    }
  };

  const getMessage = () => {
    switch (type) {
      case "reset":
        return "We've sent a password reset link to your email address. Please check your inbox and follow the instructions to reset your password.";
      case "resend":
        return "We've sent a new verification email to your address. Please check your inbox and click the verification link.";
      default:
        return "We've sent a verification email to your address. Please check your inbox and click the verification link to activate your account.";
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-8 bg-linear-to-br from-accent/10 to-primary/20">
      <div className="max-w-md w-full">
        <Card className="w-full border-2 border-primary/20 rounded-2xl shadow-lg bg-card/70">
          <CardHeader className="space-y-4 pb-6">
            <div className="relative mx-auto">
              <div className="p-4 rounded-2xl shadow-lg bg-linear-to-br from-primary to-primary/80 mx-auto w-fit">
                <Mail className="w-7 h-7 text-primary-foreground" />
              </div>
              <CheckCircle2 className="absolute -bottom-1 -right-1 w-6 h-6 text-green-500 bg-card rounded-full" />
            </div>
            <CardTitle className="text-center text-3xl">{getTitle()}</CardTitle>
            <p className="text-center text-sm text-muted-foreground">
              {getMessage()}
            </p>
            {email && (
              <p className="text-center text-sm font-semibold text-primary">
                {email}
              </p>
            )}
          </CardHeader>

          <CardContent className="space-y-4 px-6 pb-6">
            <div className="bg-accent/20 border border-border rounded-lg p-4 space-y-2">
              <p className="text-sm font-semibold">Didn't receive the email?</p>
              <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
                <li>Check your spam or junk folder</li>
                <li>Make sure the email address is correct</li>
                <li>Wait a few minutes and check again</li>
              </ul>
            </div>

            <div className="flex flex-col gap-3">
              {type === "verification" && (
                <Link to={PATHS.RESEND_VERIFICATION}>
                  <Button variant="outline" className="w-full">
                    Resend Verification Email
                  </Button>
                </Link>
              )}
              <Link to={PATHS.LOGIN}>
                <Button className="w-full">Back to Login</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default CheckEmail;
