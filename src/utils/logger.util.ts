type LogLevel = "info" | "warn" | "error" | "debug";

interface LogPayload {
  message: string;
  [key: string]: any;
}

const formatLog = (level: LogLevel, payload: LogPayload): string => {
  const timestamp = new Date().toISOString();
  const { message, ...rest } = payload;
  const extra = Object.keys(rest).length ? JSON.stringify(rest) : "";
  return `[${timestamp}] [${level.toUpperCase()}] ${message} ${extra}`.trim();
};

export const logger = {
  info: (payload: LogPayload) => console.log(formatLog("info", payload)),
  warn: (payload: LogPayload) => console.warn(formatLog("warn", payload)),
  error: (payload: LogPayload) => console.error(formatLog("error", payload)),
  debug: (payload: LogPayload) => {
    if (process.env.NODE_ENV !== "production") {
      console.debug(formatLog("debug", payload));
    }
  },
};
