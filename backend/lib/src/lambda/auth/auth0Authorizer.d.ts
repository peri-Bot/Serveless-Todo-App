import { CustomAuthorizerEvent, CustomAuthorizerResult } from 'aws-lambda';
import 'source-map-support/register';
export declare const handler: (event: CustomAuthorizerEvent) => Promise<CustomAuthorizerResult>;
