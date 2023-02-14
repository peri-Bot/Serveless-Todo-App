import { APIGatewayProxyEvent } from "aws-lambda";
/**
 * Get a user id from an API Gateway event
 * @param event an event from API Gateway
 *
 * @returns a user id from a JWT token
 */
export declare function getUserId(event: APIGatewayProxyEvent): string;
