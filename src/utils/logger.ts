import colors from "colors";

// Definisi level log yang sesuai dengan colors.js
type LogLevel = "info" | "help" | "warn" | "error" | "debug";

// Pemetaan warna yang benar
const levelColors: Record<LogLevel, (text: string) => string> = {
    info: colors.green,
    help: colors.cyan,
    warn: colors.yellow,
    error: colors.red,
    debug: colors.blue,
};

const log = {
    logMessage: (level: LogLevel, message: string, data?: unknown) => {
        const logData = data
            ? `: ${data instanceof Error ? data.message : JSON.stringify(data)}`
            : "";
        const coloredMessage = levelColors[level](
            `[${level.toUpperCase()}] ${message}${logData}`,
        );
        console.log(coloredMessage);
    },

    info: (message: string, data?: unknown) =>
        log.logMessage("info", message, data),
    help: (message: string, data?: unknown) =>
        log.logMessage("help", message, data),
    warn: (message: string, data?: unknown) =>
        log.logMessage("warn", message, data),
    error: (message: string, data?: unknown) =>
        log.logMessage("error", message, data),
    debug: (message: string, data?: unknown) =>
        log.logMessage("debug", message, data),
};

export default log;
