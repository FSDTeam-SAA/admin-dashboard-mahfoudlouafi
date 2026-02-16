export function getErrorMessage(error: unknown, fallback: string) {
  if (typeof error === "string") return error;
  if (error && typeof error === "object") {
    const message = (error as { response?: { data?: { message?: string } }; message?: string }).response?.data?.message;
    if (message) return message;
    const generic = (error as { message?: string }).message;
    if (generic) return generic;
  }
  return fallback;
}
