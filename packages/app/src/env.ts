import ark from "ark.env";

export const env = ark.env(
  {
    VITE_CHAIN_ID: "'690'",
    VITE_NAME_SERVICE_URL: "string",
    VITE_NAME_SERVICE_BEARER: "string",
    VITE_METRICS_API_URL: "string",
  },
  import.meta.env
);
