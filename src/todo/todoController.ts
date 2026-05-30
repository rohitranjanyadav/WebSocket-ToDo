import type { Socket } from "socket.io";
import { getSocketIo } from "../../server.ts";
import todoModel from "./todoModel.ts";
import type { ITodo } from "./todoTypes.ts";

class Todo {
  private io = getSocketIo();
  constructor() {
    this.io.on("connection", (socket: Socket) => {
      console.log("New Client Connected!");

      socket.on("addTodo", (data) => this.handleAddTodo(socket, data));
    });
  }

  private async handleAddTodo(socket: Socket, data: ITodo) {
    const { task, deadLine, status } = data;

    try{await todoModel.create({
      task,
      deadLine,
      status,
    });
    const todos = await todoModel.find()

    socket.emit("todos_updated",{
      status:"success",
      data:todos
    })}catch(error){
      socket.emit("todo_response",{
        status:"error",
        error
      })
    }
  }
}

export default new Todo();
