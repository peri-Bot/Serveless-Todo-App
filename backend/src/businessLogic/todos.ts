import { TodosAccess } from '../dataLayer/todosAcess'
import { AttachmentUtils } from '../fileStorage/attachmentUtils';
import { TodoItem } from '../models/TodoItem'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
import { createLogger } from '../utils/logger'
import * as uuid from 'uuid'
import { TodoUpdate } from '../models/TodoUpdate';
// import * as createError from 'http-errors'

// TODO: Implement businessLogic
const logger = createLogger('TodosAccess')
const attachmentUtils = new AttachmentUtils()
const todosAccess = new TodosAccess()
// Get Todos
export async function getTodosForUser(userId: string): Promise<TodoItem[]>{
    logger.info('getTodosForUser called')
    return todosAccess.getAllTodos(userId)
}
// Create Todo
export async function createTodo(
    userId: string,
    newTodo: CreateTodoRequest
): Promise<TodoItem>{
    logger.info('createTodo called')

    const todoId = uuid.v4()
    const attachmentUrl = attachmentUtils.getAttachmentUrl(todoId)
    const done:boolean = false
    
    const newItem: TodoItem = {
        userId,
        todoId,
        createdAt: new Date().toISOString(),
        done,
        attachmentUrl,
        ...newTodo
    }

    try {
	    await todosAccess.createTodoItem(newItem)
        logger.info('Create todo',{newItem})
    } catch (error) {
        logger.info('Create todo',{Error: error,newItem})
    }
    return newItem as TodoItem
}

export async function updateTodo(todoId:string,updatedTodo:UpdateTodoRequest,userId:string): Promise<TodoUpdate> {
    logger.info('updateTodo called called by user',userId,todoId)

    return todosAccess.updateTodoItem(todoId,userId,updatedTodo)
}

export async function deleteTodo(userId:string,todoId:string): Promise<string> {
    logger.info('deleteTodo called called by user',userId,todoId)
    
    return todosAccess.deleteTodoItem(userId,todoId)
}

export async function createAttachmentPresignedUrl(userId:string,todoId:string): Promise<string>{
    logger.info('createAttachmentPresignedUrl called by user',userId,todoId)

    return attachmentUtils.getUploadedUrl(todoId)
}