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
import { LockKeyhole, LogIn, Mail } from "lucide-react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

function Login() {
  function click() {
    toast.error("Login clicked!");
  }
  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-8 bg-gradient-to-br from-accent/10 to-primary/20">
      <div className="max-w-md w-full">
        <Card className="w-full border-2 border-primary/20 rounded-2xl shadow-lg bg-card/60">
          <CardHeader className="space-y-2 pb-6">
            <div className="p-3 rounded-2xl shadow-md bg-primary mx-auto">
              <LogIn className="w-7 h-7" />
            </div>
            <CardTitle className="text-center text-3xl">Welcome Back</CardTitle>
            <p className="text-center text-sm text-muted-foreground">
              Enter your credentials to access your account
            </p>
          </CardHeader>
          <CardContent className="space-y-2 px-6">
            <div className="space-y-3">
              <Label className="block font-semibold" htmlFor="email">
                Email Address
              </Label>
              <div className="relative group ">
                <Mail className="absolute top-3 left-3 w-5 h-5 text-muted-foreground group-focus-within:text-primary" />
                <Input
                  className="pl-10 h-11 bg-accent/60!"
                  id="email"
                  type="email"
                  placeholder="Email"
                />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="block font-semibold" htmlFor="password">
                  Password
                </Label>
                <Link
                  to={PATHS.FORGOT_PASSWORD}
                  className="text-sm text-primary hover:underline font-semibold"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative group">
                <LockKeyhole className="absolute top-3 left-3 w-5 h-5 text-muted-foreground group-focus-within:text-primary" />
                <Input
                  className="pl-10 h-11 bg-accent/60!"
                  id="password"
                  type="password"
                  placeholder="Password"
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="px-6">
            <Button onClick={click} className="w-full h-10 hover:bg-primary/80">
              Sign In
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
                Login with Google
              </Button>
              <p className="text-center text-sm text-muted-foreground">
                Don't have an account?{" "}
                <Link
                  to={PATHS.REGISTER}
                  className="text-primary hover:underline font-semibold"
                >
                  Sign up
                </Link>
              </p>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

export default Login;
