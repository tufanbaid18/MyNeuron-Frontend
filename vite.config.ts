import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";
import { validateEnv } from "./src/config/env.config";
import { envSchema } from "./src/config/env.schema";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, process.cwd(), "");

  // Validate the environment variables and throw error if invalid during server startup
  validateEnv(env, envSchema, true);

  return {
    plugins: [react(), tailwindcss()],
    server: {
      host: true,
      allowedHosts: [
        "0.0.0.0",
        "myneuron.com",
        "doubtable-rudolph-colossally.ngrok-free.dev",
      ],
    },
  };
});
