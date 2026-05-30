export enum Status {
  Completed = "completed",
  Pending = "pending",
}

export interface ITodo {
  task: string;
  deadLine: string;
  status: Status;
}
