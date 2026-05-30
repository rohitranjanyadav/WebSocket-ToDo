import app from "./src/app.ts";
import { envConfig } from "./src/config/config.ts";
import connectToDB from "./src/config/db.ts";
import { Server } from "socket.io";

let io: Server | undefined;

function startServer() {
  connectToDB();
  const port = envConfig.port || 4000;
  const server = app.listen(port, () => {
    console.log(`Server started at PORT:${port}`);
  });

  const io = new Server(server);

  // io.on("connection", (socket) => {
  //   socket.on("hello", (data) => {
  //     console.log(data);
  //     socket.emit("response", {
  //       message: "Data received",
  //     });
  //   });
  //   console.log("Someone connected(client)");
  // });
}

function getSocketIo() {
  if (!io) throw new Error("SocketIo not initialized");

  return io;
}

startServer();
export {getSocketIo}
