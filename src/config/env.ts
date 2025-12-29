import { z } from "zod";

const envSchema = z.object({
    VITE_API_BASE_URL: z.string().url("VITE_API_BASE_URL must be a valid URL"),
    MODE: z.string().optional(),
    DEV: z.boolean().optional(),
    PROD: z.boolean().optional(),
});

const envVars = {
    VITE_API_BASE_URL: import.meta.env.VITE_API_BASE_URL,
    MODE: import.meta.env.MODE,
    DEV: import.meta.env.DEV,
    PROD: import.meta.env.PROD,
};

const parsedEnv = envSchema.safeParse(envVars);

if (!parsedEnv.success) {
    console.error(
        "❌ Invalid environment variables:",
        JSON.stringify(parsedEnv.error.format(), null, 4)
    );
    throw new Error("Invalid environment variables");
}

export const env = parsedEnv.data;
