import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { runMigrations } from "./migrate";

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
    console.log("Starting application...");
    
    // Use in-memory storage for development
    console.log("Using in-memory storage for development...");
    
    console.log("Registering routes...");
    const server = await registerRoutes(app);

    app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
      const status = err.status || err.statusCode || 500;
      const message = err.message || "Internal Server Error";

      res.status(status).json({ message });
      throw err;
    });

    // Setup serving based on environment
    if (process.env.NODE_ENV === "production") {
      console.log("Setting up production static file serving...");
      serveStatic(app);
    } else {
      console.log("Setting up development mode with Vite...");
      await setupVite(app, server);
    }

    // Use Railway's PORT environment variable or fallback to 5000 for local development
    const port = Number(process.env.PORT) || 5000;
    const host = '0.0.0.0';
    
    console.log(`Attempting to start server on ${host}:${port}`);
    server.listen(port, host, () => {
      log(`✅ Server successfully started on ${host}:${port}`);
      console.log("Application is ready to receive requests");
    });
  } catch (error) {
    console.error("❌ Failed to start application:", error);
    process.exit(1);
  }
})();
