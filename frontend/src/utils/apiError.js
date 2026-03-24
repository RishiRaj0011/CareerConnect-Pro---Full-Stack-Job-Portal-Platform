/**
 * Extracts a user-facing error message from an Axios error.
 *
 * Handles two backend response shapes:
 *   1. Operational errors  → { success: false, message: "..." }
 *   2. Zod validation      → { success: false, message: "Validation Error", errors: [{ field, message }] }
 */
export const getApiError = (error) => {
    const data = error?.response?.data;
    if (!data) return "Network error. Please check your connection.";

    // Zod validation: show all field-level messages joined
    if (Array.isArray(data.errors) && data.errors.length > 0) {
        return data.errors.map((e) => e.message).join(" • ");
    }

    return data.message || "Something went wrong. Please try again.";
};
