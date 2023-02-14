import 'source-map-support/register';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import * as middy from 'middy';
export declare const handler: middy.Middy<APIGatewayProxyEvent, APIGatewayProxyResult>;
