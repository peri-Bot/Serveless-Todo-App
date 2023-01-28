import * as AWS from 'aws-sdk'
const AWSXRay = require('aws-xray-sdk')
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { createLogger } from '../utils/logger'
import { TodoItem } from '../models/TodoItem'
import { TodoUpdate } from '../models/TodoUpdate';
import { Document } from 'aws-sdk/clients/kendra';

const XAWS = AWSXRay.captureAWS(AWS)

const logger = createLogger('TodosAccess')

// TODO: Implement the dataLayer logic
export class TodosAccess{
    constructor(
        private readonly docClient: DocumentClient = createDynamoDBClient(),
        private readonly todoTable = process.env.TODOS_TABLE,
        private readonly todoTableIndex = process.env.TODOS_CREATED_AT_INDEX
    ){}

    async todoExists(userID:string,todoID:string): Promise<Boolean>{
        const todoItem = await this.docClient.get({
          TableName:this.todoTable,
          Key:{
            userID,
            todoID
          }
        }).promise()
        return !!todoItem.Item
    }

    async getAllTodos(userId:string): Promise<TodoItem[]> {
        console.log('Getting all todos')
    
        const result = await this.docClient.query({
          TableName: this.todoTable,
          IndexName: this.todoTableIndex,
          KeyConditionExpression:'userId = :userId',
          ExpressionAttributeValues: {
            ':userId': userId
          },
          ScanIndexForward: false
        }).promise()
    
        const items = result.Items
        return items as TodoItem[]
    }    

    async createTodo(todo: TodoItem): Promise<TodoItem> {
        await this.docClient.put({
          TableName: this.todoTable,
          Item: todo
        }).promise()
    
        return todo
    }

    async updateTodo(userId:string,todoId:string,updatedTodo: TodoUpdate) {
        if(!this.todoExists(userId,todoId)){
          throw new Error('Invalid Todo')
        }
        await this.docClient.update({
            TableName: this.todoTable,
            Key:{
                todoId,
                userId
            },
            UpdateExpression:`set name = :name, dueDate = :dueDate, done = :done`,
            ExpressionAttributeValues: {
              ":name": updatedTodo.name,
              ":dueDate": updatedTodo.dueDate,
              ":done": updatedTodo.done
            },
            ReturnValues:"Updated"
        }).promise
    }

    async deleteTodo(userId:string,todoId:string){
        if(!this.todoExists(userId,todoId)){
          throw new Error('Invalid Todo')
        }

        await this.docClient.delete({
          TableName:this.todoTable,
          Key:{
            todoId,
            userId
          }
        }).promise()
    }

    async generateUploadedUrl(userID:string,todoID:string,attachmentUrl:string){
      if(!this.todoExists){
          throw new Error('Invalid Todo')
      }

      await this.docClient.update({
        TableName:this.todoTable,
        Key:{
          userID,
          todoID
        },
        UpdateExpression:`set attachmentUrl = :attachmentUrl`,
        ExpressionAttributeValues:{
          ":attachmentUrl": attachmentUrl
        },
        ReturnValues:"AttachmentUrl Attached"
      }).promise()
    }
}
function createDynamoDBClient() {
    if (process.env.IS_OFFLINE) {
      console.log('Creating a local DynamoDB instance')
      return new XAWS.DynamoDB.DocumentClient({
        region: 'localhost',
        endpoint: 'http://localhost:8000'
      })
    }
  
    return new XAWS.DynamoDB.DocumentClient()
}