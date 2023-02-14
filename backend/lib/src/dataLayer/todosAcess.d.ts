import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { TodoItem } from '../models/TodoItem';
import { TodoUpdate } from '../models/TodoUpdate';
export declare class TodosAccess {
    private readonly docClient;
    private readonly todoTable;
    private readonly todoTableIndex;
    constructor(docClient?: DocumentClient, todoTable?: string, todoTableIndex?: string);
    todoExists(userID: string, todoID: string): Promise<Boolean>;
    getAllTodos(userId: string): Promise<TodoItem[]>;
    createTodo(todo: TodoItem): Promise<TodoItem>;
    updateTodo(userId: string, todoId: string, updatedTodo: TodoUpdate): Promise<void>;
    deleteTodo(userId: string, todoId: string): Promise<void>;
    generateUploadedUrl(userID: string, todoID: string, attachmentUrl: string): Promise<void>;
}
