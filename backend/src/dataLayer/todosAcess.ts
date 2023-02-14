import * as AWS from 'aws-sdk'
var AWSXRay = require('aws-xray-sdk')
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { createLogger } from '../utils/logger'
import { TodoItem } from '../models/TodoItem'
//import { UpdateTodoRequest } from '../requests/UpdateTodoRequest';
import { TodoUpdate } from '../models/TodoUpdate';

const XAWS = AWSXRay.captureAWS(AWS)

const logger = createLogger('TodosAccess')
// TODO: Implement the dataLayer logic
export class TodosAccess{
    constructor(
        private readonly docClient: DocumentClient = new XAWS.DynamoDB.DocumentClient(),
        private readonly todosTable = process.env.TODOS_TABLE,
        private readonly indexName = process.env.TODOS_CREATED_AT_INDEX
    ){}
    
    //Get All Todos for a user
    async  getAllTodos(userId:string): Promise<TodoItem[]> {
        logger.info('getAllTodos called')

        const res = await this.docClient.query({
            TableName: this.todosTable,
            IndexName: this.indexName,
            KeyConditionExpression: 'userId = :userId',
            ExpressionAttributeValues: {
                ':userId': userId
            }
            
        }).promise()

        const items = res.Items
        return items as TodoItem[]
    }

    //Create Todo Item
    async createTodoItem(todoItem: TodoItem): Promise<TodoItem>{
        logger.info('createTodoItem called')

        await this.docClient.put({
            TableName: this.todosTable,
            Item: todoItem
        }).promise()
        logger.info('Create Todo-> ',{
            todoItem
        })
        return todoItem
    }

    //Update Todo Item
    async updateTodoItem(todoId:string,userId:string,todoUpdate:TodoUpdate): Promise<TodoUpdate>{
        logger.info('updateTodoItem called')

        const res = await this.docClient.update({
            TableName: this.todosTable,
            Key: {
                userId,
                todoId
            },
            UpdateExpression:'set #name = :name, dueDate = :dueDate, done = :done',
            ExpressionAttributeValues:{
                ':name': todoUpdate.name,
                ':dueDate': todoUpdate.dueDate,
                ':done': todoUpdate.done
            },
            ExpressionAttributeNames: {
                '#name': 'name'
            },
            ReturnValues: 'ALL_NEW'
        }).promise()

        const todoItemUpdate = res.Attributes
        logger.info('Todo item updated',todoItemUpdate)
        return todoItemUpdate as TodoUpdate
    }

    //Delete Todo Item
    async deleteTodoItem(userId:string,todoId:string): Promise<string> {
       logger.info('DeleteTodoItem called')

       const res = await this.docClient.delete(
            {
                TableName: this.todosTable,
                Key:{
                    userId,
                    todoId
                }
            }
        ).promise()
        logger.info('Todo Item deleted', res)

        return todoId as string
        
    }

    //Attach Uploaded file
    async attachUploadedFile(url:string,userId:string,todoId:string) {

        await this.docClient.update({
            TableName: this.todosTable,
            Key: {
                userId,
                todoId
            },
            UpdateExpression: 'set attachmentUrl = :attachmentUrl',
            ExpressionAttributeValues: {
                ':attachmentUrl': url
            }
        }).promise()
        
    }
}