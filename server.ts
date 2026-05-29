import app from "./src/app.ts";
import { envConfig } from "./src/config/config.ts";

function startServer() {
  const port = envConfig.port || 4000;
  app.listen(port, () => {
    console.log(`Server started at PORT:${port}`);
  });
}

startServer();
