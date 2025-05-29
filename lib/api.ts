const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

export async function api<T = any>(
  endpoint: string,
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH" = "GET",
  data?: any,
  isFormData = false
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;

  // Get token from localStorage
  const token =
    typeof window !== "undefined" ? localStorage.getItem("access_token") : null;

  const config: RequestInit = {
    method,
    headers: {
      Accept: "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      // Only add Content-Type for non-FormData requests
      ...(!isFormData && { "Content-Type": "application/json" }),
    },
    // Add credentials for CORS
    credentials: "include",
  };

  if (data && method !== "GET") {
    if (isFormData) {
      // For FormData, don't set Content-Type header (browser will set it with boundary)
      config.body = data;
    } else {
      config.body = JSON.stringify(data);
    }
  }

  try {
    console.log(`🚀 Making ${method} request to: ${url}`);
    if (!isFormData) {
      console.log(`📦 Request data:`, data);
    }

    const response = await fetch(url, config);

    console.log(`📡 Response status: ${response.status}`);
    console.log(
      `📡 Response headers:`,
      Object.fromEntries(response.headers.entries())
    );

    if (!response.ok) {
      let errorMessage = `HTTP error! status: ${response.status}`;
      let errorData: any = {};

      try {
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          errorData = await response.json();
          console.log(`❌ Error response:`, errorData);
        } else {
          const textError = await response.text();
          console.log(`❌ Text error response:`, textError);
          errorMessage = textError || errorMessage;
        }

        // Handle specific error cases
        if (errorData.detail) {
          errorMessage = errorData.detail;
        } else if (errorData.message) {
          errorMessage = errorData.message;
        } else if (errorData.non_field_errors) {
          errorMessage = errorData.non_field_errors[0];
        } else if (errorData.email) {
          errorMessage = `Email: ${errorData.email[0]}`;
        } else if (errorData.password) {
          errorMessage = `Password: ${errorData.password[0]}`;
        } else if (errorData.full_name) {
          errorMessage = `Full name: ${errorData.full_name[0]}`;
        }
      } catch (parseError) {
        console.error("❌ Failed to parse error response:", parseError);
      }

      const error = new Error(errorMessage);
      (error as any).status = response.status;
      (error as any).data = errorData;
      throw error;
    }

    // Handle successful responses
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      const result = await response.json();
      console.log(`✅ Success response:`, result);
      return result;
    } else {
      console.log(`✅ Non-JSON response`);
      return {} as T;
    }
  } catch (error) {
    console.error(`💥 API Error for ${method} ${url}:`, error);

    // Provide more specific error messages
    if (error instanceof TypeError && error.message.includes("fetch")) {
      throw new Error(
        "Unable to connect to server. Please check if the backend is running at " +
          API_BASE_URL
      );
    }

    throw error;
  }
}
