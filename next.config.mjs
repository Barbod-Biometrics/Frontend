/** @type {import('next').NextConfig} */
const normalizeBase = (value) => value.replace(/\/+$/, "");

const DEFAULT_PUBLIC_API_BASE_PATH = "/api/v1";
const DEFAULT_BACKEND_API_BASE_URL = "https://api.barbodbiometrics.ir/api/v1";

const configuredPublicBase = process.env.NEXT_PUBLIC_API_BASE_URL?.trim();
const publicBasePath =
  configuredPublicBase && configuredPublicBase.startsWith("/")
    ? normalizeBase(configuredPublicBase)
    : DEFAULT_PUBLIC_API_BASE_PATH;

const configuredBackendBase =
  process.env.API_BACKEND_BASE_URL?.trim() ??
  (configuredPublicBase && /^https?:\/\//.test(configuredPublicBase)
    ? configuredPublicBase
    : undefined);
const backendBaseUrl =
  configuredBackendBase && /^https?:\/\//.test(configuredBackendBase)
    ? normalizeBase(configuredBackendBase)
    : DEFAULT_BACKEND_API_BASE_URL;

const nextConfig = {
    /* config options here */
    reactStrictMode: true,
    typescript: {
        // !! WARN !!
        // Dangerously allow production builds to successfully complete even if
        // your project has type errors.
        ignoreBuildErrors: true,
    },
    async rewrites() {
        if (configuredPublicBase?.startsWith("/") && !process.env.API_BACKEND_BASE_URL) {
            return [];
        }

        return [
            {
                source: `${publicBasePath}/:path*`,
                destination: `${backendBaseUrl}/:path*`,
            },
        ];
    },
};

export default nextConfig;
