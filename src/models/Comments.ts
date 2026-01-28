export interface Comment {
  id: number;
  taskId: number;
  userId: number;
  message: string;
  createdAt: Date;
}