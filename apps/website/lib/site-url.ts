const productionHost = process.env.VERCEL_PROJECT_PRODUCTION_URL;

export const siteUrl = new URL(
  productionHost ? `https://${productionHost}` : "http://localhost:3000",
);
