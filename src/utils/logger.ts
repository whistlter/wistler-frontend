// src/utils/logger.ts
import { env } from "@/config/env";


/**
 * proper logger abstraction.
 * In production, you would swap console.log with a service like Sentry or LogRocket.
 */
class Logger {
    private isDev = env.DEV;

    info(message: string, ...args: unknown[]) {
        if (this.isDev) {
            console.log(`[INFO] ${message}`, ...args);
        }
    }

    warn(message: string, ...args: unknown[]) {
        console.warn(`[WARN] ${message}`, ...args);
    }

    error(message: string, error?: unknown, ...args: unknown[]) {
        console.error(`[ERROR] ${message}`, error, ...args);
        // TODO: Send to Sentry/LogRocket here
    }
}

export const logger = new Logger();
