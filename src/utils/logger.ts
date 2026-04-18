// ============================================================
//  LOGGER UTILITY
// ============================================================

type LogLevel = "info" | "success" | "warn" | "error";

const icons: Record<LogLevel, string> = {
  info:    "⏳",
  success: "✅",
  warn:    "⚠️ ",
  error:   "❌",
};

export const logger = {
  info:    (msg: string) => console.log(`  ${icons.info} ${msg}`),
  success: (msg: string) => console.log(`  ${icons.success} ${msg}`),
  warn:    (msg: string) => console.warn(`  ${icons.warn} ${msg}`),
  error:   (msg: string) => console.error(`  ${icons.error} ${msg}`),
  divider: (title: string) => {
    console.log("\n========================================");
    console.log(`  ${title}`);
    console.log("========================================");
  },
};