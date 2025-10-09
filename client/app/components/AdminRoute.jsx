"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { isAuthenticated, isAdmin } from "../lib/clientAuth";

export default function AdminRoute({ children }) {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkAdminAccess = () => {
      try {
        // Check if user is authenticated
        if (!isAuthenticated()) {
          router.push("/signin");
          return;
        }

        // Check if user has admin role
        if (!isAdmin()) {
          // Redirect non-admin users to dashboard
          router.push("/dashboard-v2");
          return;
        }

        setIsAuthorized(true);
      } catch (error) {
        console.error("Error checking admin access:", error);
        router.push("/signin");
      } finally {
        setIsLoading(false);
      }
    };

    checkAdminAccess();
  }, [router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!isAuthorized) {
    return null;
  }

  return children;
}
