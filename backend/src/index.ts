import "dotenv/config";
import express from "express";
import cors from "cors";

import authRoutes from "./routes/auth.js";
import preferencesRoutes from "./routes/preferences.js";
import dashboardRoutes from "./routes/dashboard.js";
import votesRoutes from "./routes/votes.js";

const app = express();

// In production, lock CORS to the deployed frontend (set CLIENT_ORIGIN on the
// host). Locally, with no CLIENT_ORIGIN set, allow any origin for convenience.
const clientOrigin = process.env.CLIENT_ORIGIN;
app.use(cors(clientOrigin ? { origin: clientOrigin } : undefined));
app.use(express.json());

app.get("/api/health", (_req, res) => res.json({ ok: true }));

app.use("/api/auth", authRoutes);
app.use("/api/preferences", preferencesRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/votes", votesRoutes);

const PORT = process.env.PORT ?? 4000;
app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`));
