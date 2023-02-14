import { TodoItem } from '../models/TodoItem';
import { CreateTodoRequest } from '../requests/CreateTodoRequest';
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest';
export declare function getTodosForUser(userId: string): Promise<TodoItem[]>;
export declare function createTodo(createTodoRequest: CreateTodoRequest, userId: string): Promise<TodoItem>;
export declare function updateTodo(updateTodoRequest: UpdateTodoRequest, userId: string, todoId: string): Promise<void>;
export declare function deleteTodo(userId: string, todoId: string): Promise<void>;
export declare function createAttachmentPresignedUrl(userID: string, todoId: string): Promise<any>;
