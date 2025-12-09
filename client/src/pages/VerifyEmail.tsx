import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PATHS } from "@/config/paths";
import useAuthStore from "@/stores/auth.store";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const [message, setMessage] = useState<string>("");
  const token = searchParams.get("token");
  const { emailVerification } = useAuthStore();
  useEffect(() => {
    const verifyEmailFunc = async () => {
      if (!token) {
        setStatus("error");
        setMessage("Invalid verification token");
        return;
      }

      const result = await emailVerification(token);
      if (result.success) {
        setStatus("success");
        setMessage("Your email has been verified successfully!");
      }
      if (!result.success) {
        setStatus("error");
        setMessage(
          "Email verification failed. The link may be invalid or expired."
        );
      }
    };

    verifyEmailFunc();
  }, [token]);

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-8 bg-linear-to-br from-accent/10 to-primary/20">
      <div className="max-w-md w-full">
        <Card className="w-full border-2 border-primary/20 rounded-2xl shadow-lg bg-card/70">
          <CardHeader className="space-y-4 pb-6">
            <div className="p-4 rounded-2xl shadow-lg bg-linear-to-br from-primary to-primary/80 mx-auto w-fit">
              {status === "loading" && (
                <Loader2 className="w-7 h-7 text-primary-foreground animate-spin" />
              )}
              {status === "success" && (
                <CheckCircle2 className="w-7 h-7 text-primary-foreground" />
              )}
              {status === "error" && (
                <XCircle className="w-7 h-7 text-primary-foreground" />
              )}
            </div>
            <CardTitle className="text-center text-3xl">
              {status === "loading" && "Verifying Email..."}
              {status === "success" && "Email Verified!"}
              {status === "error" && "Verification Failed"}
            </CardTitle>
            <p className="text-center text-sm text-muted-foreground">
              {message}
            </p>
          </CardHeader>

          <CardContent className="space-y-4 px-6 pb-6">
            {status === "success" && (
              <Link to={PATHS.LOGIN}>
                <Button className="w-full">Go to Login</Button>
              </Link>
            )}

            {status === "error" && (
              <div className="flex flex-col gap-3">
                <Link to={PATHS.RESEND_VERIFICATION}>
                  <Button className="w-full">Resend Verification Email</Button>
                </Link>
                <Link to={PATHS.LOGIN}>
                  <Button variant="outline" className="w-full">
                    Back to Login
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default VerifyEmail;
