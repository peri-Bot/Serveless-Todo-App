import { TodosAccess } from '../dataLayer/todosAcess'
import { AttachmentUtils } from '../fileStorage/attachmentUtils';
import { TodoItem } from '../models/TodoItem'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
import { createLogger } from '../utils/logger'
import * as uuid from 'uuid'
import * as createError from 'http-errors'


// TODO: Implement businessLogic
const todoAccess = new TodosAccess()

export async function getTodosForUser(userId:string): Promise<TodoItem[]> {
  return todoAccess.getAllTodos(userId)
}

export async function createTodo(
  createTodoRequest: CreateTodoRequest,
  userId: string
): Promise<TodoItem> {

  const itemId = uuid.v4()

  return await todoAccess.createTodo({
    todoId: itemId,
    userId,
    name: createTodoRequest.name,
    dueDate: createTodoRequest.dueDate,
    done:false,
    createdAt: new Date().toISOString(),
    attachmentUrl:null
  })
}

export async function updateTodo(
  updateTodoRequest: UpdateTodoRequest,
  userId:string,
  todoId: string
  ) {
    return await todoAccess.updateTodo(
      userId,
      todoId,
      updateTodoRequest
    )
}

export async function deleteTodo(userId:string,todoId:string) {
    return await todoAccess.deleteTodo(userId,todoId)
}

export async function createAttachmentPresignedUrl(userID:string,todoId:string) {
    
}