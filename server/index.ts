import 'reflect-metadata';
import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes.js";
import { initializeDatabase } from "./database.config.js";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function log(message: string, source = "express") {
  const timestamp = new Date().toLocaleTimeString();
  console.log(`${timestamp} [${source}] ${message}`);
}

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  try {
    // Initialize MongoDB connection
    await initializeDatabase();
    
    const server = await registerRoutes(app);

    app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
      const status = err.status || err.statusCode || 500;
      const message = err.message || "Internal Server Error";

      res.status(status).json({ message });
      throw err;
    });

    // Serve Next.js static files in production
    if (app.get("env") === "production") {
      const nextStaticPath = path.join(__dirname, "../.next/static");
      app.use("/_next/static", express.static(nextStaticPath));

      const publicPath = path.join(__dirname, "../public");
      app.use(express.static(publicPath));
    }

    // Fallback 404 handler for API routes only
    app.use("/api/*", (req, res) => {
      res.status(404).json({ message: "API endpoint not found" });
    });

    // ALWAYS serve the app on port 5000
    // this serves both the API and the client.
    // It is the only port that is not firewalled.
    const port: any = process.env.PORT || 5000;
    server.listen(port, "0.0.0.0", () => {
      log(`Express API server running on port ${port}`);
      if (app.get("env") === "development") {
        log("Next.js should be running on port 3000");
        log("API endpoints available at http://localhost:5000/api/");
      }
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
})();