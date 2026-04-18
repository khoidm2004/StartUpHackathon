import dotenv from "dotenv";
import { createApp } from "./http/createApp";

dotenv.config({ path: ".env" });

const app = createApp();
const PORT = Number(process.env.PORT) || 3001;

app.listen(PORT, () => {
  console.log(`\n🇫🇮  Server → http://localhost:${PORT}`);
  console.log(`     GET  /api/finland-summary   — Finland pipeline`);
  console.log(`     POST /api/finland-summary   — same`);
  console.log(`     POST /api/generateContent   — content generator`);
  console.log(`     GET  /api/groq-test         — smoke test`);
  console.log(`     GET  /health\n`);
});
