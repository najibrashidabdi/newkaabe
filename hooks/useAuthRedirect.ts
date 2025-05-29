// hooks/useAuthRedirect.ts
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

interface DashboardResponse {
  is_pro: boolean;
  // ... other fields
}

const useAuthRedirect = (landingPagePath: string = "/"): boolean => {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const API_BASE_URL = process.env.NEXT_PUBLIC_API;
  console.log(
    "[AuthRedirect] Hook initialized. Pathname:",
    pathname,
    "Target Landing Page:",
    landingPagePath
  );
  console.log("[AuthRedirect] NEXT_PUBLIC_API:", API_BASE_URL);

  useEffect(() => {
    console.log(
      "[AuthRedirect] useEffect triggered. API_BASE_URL:",
      API_BASE_URL,
      "Pathname:",
      pathname
    );

    if (typeof window === "undefined") {
      console.log("[AuthRedirect] SSR, returning.");
      return;
    }

    if (!API_BASE_URL) {
      console.error(
        "[AuthRedirect] NEXT_PUBLIC_API environment variable is not set."
      );
      setIsLoading(false);
      return;
    }

    if (pathname !== landingPagePath) {
      console.log(
        `[AuthRedirect] Not on landing page ('${pathname}' !== '${landingPagePath}'). Setting isLoading to false.`
      );
      setIsLoading(false);
      return;
    }

    console.log("[AuthRedirect] On landing page, proceeding with auth check.");

    const checkStatusAndRedirect = async () => {
      const accessToken = localStorage.getItem("accessToken");
      console.log(
        "[AuthRedirect] Access Token:",
        accessToken ? "Found" : "Not Found"
      );

      if (!accessToken) {
        console.log(
          "[AuthRedirect] No access token. Setting isLoading to false."
        );
        setIsLoading(false);
        return;
      }

      try {
        const dashboardUrl = `${API_BASE_URL}/api/dashboard/`;
        console.log(
          `[AuthRedirect] Fetching dashboard data from: ${dashboardUrl}`
        );

        const response = await fetch(dashboardUrl, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        });

        console.log("[AuthRedirect] API Response Status:", response.status);

        if (response.ok) {
          const data = (await response.json()) as DashboardResponse;
          console.log("[AuthRedirect] API Response Data:", data);

          if (data && typeof data.is_pro !== "undefined") {
            // Explicit check for is_pro
            if (data.is_pro) {
              console.log(
                "[AuthRedirect] User is PRO. Redirecting to /dashboard"
              );
              router.replace("/dashboard");
            } else {
              console.log(
                "[AuthRedirect] User is NOT PRO. Redirecting to /activate-pro (or /subscribe)"
              );
              router.replace("/activate-pro"); // Change to /subscribe if that's your page
            }
          } else {
            console.error(
              '[AuthRedirect] "is_pro" field missing or undefined in API response. Data:',
              data
            );
            setIsLoading(false); // Stay on landing if data is malformed
          }
        } else if (response.status === 401) {
          console.log(
            "[AuthRedirect] API returned 401. Clearing token, setting isLoading false."
          );
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          setIsLoading(false);
        } else {
          const errorText = await response.text();
          console.error(
            "[AuthRedirect] Failed to fetch user status (non-200, non-401):",
            response.status,
            errorText
          );
          setIsLoading(false);
        }
      } catch (error) {
        console.error("[AuthRedirect] Error in fetch try-catch block:", error);
        setIsLoading(false);
      }
    };

    checkStatusAndRedirect();
  }, [router, pathname, landingPagePath, API_BASE_URL]);

  console.log("[AuthRedirect] Hook returning isLoading:", isLoading);
  return isLoading;
};

export default useAuthRedirect;
