import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import 'source-map-support/register';
import * as middy from 'middy';
export declare const handler: middy.Middy<APIGatewayProxyEvent, APIGatewayProxyResult>;
