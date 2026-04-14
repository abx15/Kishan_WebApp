"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Icons } from "@/components/ui/icons";

export default function VerifyEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const verifyEmail = async () => {
      if (!token) {
        setError("Invalid verification link");
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/auth/verify-email?token=${token}`);
        const data = await response.json();

        if (response.ok) {
          setSuccess(data.message);
          setTimeout(() => router.push("/auth"), 3000);
        } else {
          setError(data.message || "Email verification failed");
        }
      } catch (err) {
        setError("Network error. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    verifyEmail();
  }, [token, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-green-800 mb-2">AgroBrain AI</h1>
          <p className="text-green-600">Email Verification</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Verify Your Email</CardTitle>
            <CardDescription>
              {isLoading 
                ? "Verifying your email address..."
                : success 
                  ? "Email verified successfully!"
                  : "Email verification failed"
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading && (
              <div className="flex flex-col items-center space-y-4">
                <Icons.spinner className="h-8 w-8 animate-spin text-green-600" />
                <p className="text-sm text-gray-600">Please wait while we verify your email...</p>
              </div>
            )}

            {error && (
              <Alert className="mb-4 border-red-200 bg-red-50">
                <AlertDescription className="text-red-800">
                  {error}
                </AlertDescription>
              </Alert>
            )}
            
            {success && (
              <Alert className="mb-4 border-green-200 bg-green-50">
                <AlertDescription className="text-green-800">
                  {success}
                </AlertDescription>
              </Alert>
            )}

            {!isLoading && (
              <div className="space-y-4">
                {success ? (
                  <div className="text-center space-y-4">
                    <p className="text-sm text-gray-600">
                      You will be redirected to the login page shortly.
                    </p>
                    <Button
                      onClick={() => router.push("/auth")}
                      className="w-full bg-green-600 hover:bg-green-700"
                    >
                      Go to Login
                    </Button>
                  </div>
                ) : (
                  <div className="text-center space-y-4">
                    <p className="text-sm text-gray-600">
                      The verification link may have expired or is invalid.
                    </p>
                    <div className="space-y-2">
                      <Link href="/auth">
                        <Button variant="outline" className="w-full">
                          Back to Login
                        </Button>
                      </Link>
                      <Link href="/auth/forgot-password">
                        <Button variant="ghost" className="w-full">
                          Request New Verification Email
                        </Button>
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
