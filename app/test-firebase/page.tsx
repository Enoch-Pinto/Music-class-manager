"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function TestFirebasePage() {
  const [config, setConfig] = useState<any>(null);
  const [authStatus, setAuthStatus] = useState("Checking...");
  const [error, setError] = useState("");

  useEffect(() => {
    // Check environment variables
    const firebaseConfig = {
      apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
      authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    };

    setConfig(firebaseConfig);

    // Test Firebase initialization
    const testFirebase = async () => {
      try {
        const { auth } = await import("@/lib/firebase/config");
        if (auth) {
          setAuthStatus("✅ Firebase Auth initialized successfully!");
        } else {
          setAuthStatus("❌ Firebase Auth is undefined");
        }
      } catch (err: any) {
        setError(err.message);
        setAuthStatus("❌ Firebase initialization failed");
      }
    };

    testFirebase();
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-br from-background to-secondary p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Firebase Configuration Test</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Environment Variables:</h3>
              <pre className="bg-muted p-4 rounded-lg text-sm overflow-auto">
                {JSON.stringify(config, null, 2)}
              </pre>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Auth Status:</h3>
              <p className="text-lg">{authStatus}</p>
            </div>

            {error && (
              <div className="p-4 bg-destructive/10 text-destructive rounded-lg">
                <h3 className="font-semibold mb-2">Error:</h3>
                <pre className="text-sm overflow-auto">{error}</pre>
              </div>
            )}

            <div className="pt-4">
              <a
                href="/login"
                className="text-primary hover:underline"
              >
                ← Back to Login
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
