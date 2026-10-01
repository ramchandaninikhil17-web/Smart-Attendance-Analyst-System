/**
 * Vercel Serverless Function entry point for Northstar Smart Attendance & Analytics API.
 * This file is automatically compiled by esbuild during `pnpm run build`.
 */
export default async function handler(req, res) {
  try {
    const { default: appHandler } = await import("../artifacts/api-server/dist/serverless.mjs");
    return appHandler(req, res);
  } catch (e) {
    try {
      const { default: srcHandler } = await import("../artifacts/api-server/src/serverless.ts");
      return srcHandler(req, res);
    } catch (innerErr) {
      res.statusCode = 500;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify({
        error: "API Serverless Initialization Error",
        message: innerErr?.message || e?.message,
      }));
    }
  }
}
