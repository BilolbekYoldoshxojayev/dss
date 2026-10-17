// Runs once when the server starts (not during `next build`). Fail closed.
export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const { assertEnv } = await import("@/lib/env");
    assertEnv();
  }
}
