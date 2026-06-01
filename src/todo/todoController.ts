import type { Socket } from "socket.io";
import { getSocketIo } from "../../server.ts";
import todoModel from "./todoModel.ts";
import { Status, type ITodo } from "./todoTypes.ts";

class Todo {
  private io = getSocketIo();
  constructor() {
    this.io.on("connection", (socket: Socket) => {
      console.log("New Client Connected!");

      socket.on("addTodo", (data) => this.handleAddTodo(socket, data));
      socket.on("deleteTodo", (data) => this.handleDeleteTodo(socket, data));
      socket.on("updateTodoStatus", (data) =>
        this.handleUpdateTodoStatus(socket, data),
      );
      socket.on("fetchTodos", () => this.getPendingTodos(socket));
    });
  }

  private async handleAddTodo(socket: Socket, data: ITodo) {
    const { task, deadLine, status } = data;

    try {
      await todoModel.create({
        task,
        deadLine,
        status,
      });
      await this.sendTodos(socket);
    } catch (error) {
      socket.emit("todo_response", {
        status: "error",
        error,
      });
    }
  }

  private async handleDeleteTodo(socket: Socket, data: { id: string }) {
    try {
      const { id } = data;

      const deletedTodo = await todoModel.findByIdAndDelete(id);
      if (!deletedTodo) {
        socket.emit("todo_response", {
          status: "error",
          message: "Todo Not Found!",
        });
        return;
      }
      await this.sendTodos(socket);
    } catch (error) {
      socket.emit("todo_response", {
        status: error,
        error,
      });
    }
  }

  private async handleUpdateTodoStatus(
    socket: Socket,
    data: { id: string; status: Status },
  ) {
    try {
      const { id, status } = data;
      const todo = await todoModel.findByIdAndUpdate(id, { status });
      if (!todo) {
        socket.emit("todo_response", {
          status: "error",
          message: "Todo Not Found!",
        });
        return;
      }

      await this.sendTodos(socket);
    } catch (error) {
      socket.emit("todo_response", {
        status: "error",
        error,
      });
    }
  }

  private async getPendingTodos(socket: Socket) {
    try {
      await this.sendTodos(socket);
    } catch (error) {
      socket.emit("todo_response", {
        status: "error",
        error,
      });
    }
  }

  private async sendTodos(socket: Socket) {
    const [pendingTodos, completedTodos] = await Promise.all([
      todoModel.find({ status: Status.Pending }),
      todoModel.find({ status: Status.Completed }),
    ]);

    socket.emit("todos_updated", {
      status: "success",
      data: {
        pending: pendingTodos,
        completed: completedTodos,
      },
    });
  }
}

export default new Todo();
