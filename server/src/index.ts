import express from "express";
import logger from "./utils/logger";
import morgan from "morgan";
import helmet from "helmet";
import cors from "cors";
import { notFoundHandler } from "./middlewares/notFound";
import { errorHandler } from "./middlewares/errorHandler";

const app = express();

app.use(cors());
// Security middleware
app.use(helmet());

// Middleware to parse JSON requests
app.use(express.json());
// Middleware to log requests
const morganFormat = ":method :url :status :response-time ms";
app.use(
  morgan(morganFormat, {
    stream: {
      write: (message) => {
        const logObject = {
          method: message.split(" ")[0],
          url: message.split(" ")[1],
          status: message.split(" ")[2],
          responseTime: message.split(" ")[3],
        };
        logger.info(JSON.stringify(logObject));
      },
    },
  })
);

// Routes middlewares
app.get("/", (req, res) => {
  res.send("Hello, World!");
});

// Error handling middleware
app.use(errorHandler);
// Not found middleware
app.use(notFoundHandler);

const PORT = process.env.PORT || 8080;

app
  .listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  })
  .on("error", (err) => {
    console.error("Error starting server:", err);
    process.exit(1);
  });
