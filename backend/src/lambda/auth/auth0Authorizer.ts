import { CustomAuthorizerEvent, CustomAuthorizerResult } from 'aws-lambda'
import 'source-map-support/register'

import { verify, decode } from 'jsonwebtoken'
import { createLogger } from '../../utils/logger'
import Axios from 'axios'
import { Jwt } from '../../auth/Jwt'
import { JwtPayload } from '../../auth/JwtPayload'

const logger = createLogger('auth')

// TODO: Provide a URL that can be used to download a certificate that can be used
// to verify JWT token signature.
// To get this URL you need to go to an Auth0 page -> Show Advanced Settings -> Endpoints -> JSON Web Key Set
const jwksUrl = process.env.AUTH0_CERT
let cert

export const handler = async (
  event: CustomAuthorizerEvent
): Promise<CustomAuthorizerResult> => {
  logger.info('Authorizing a user', event.authorizationToken)
  try {
    const jwtToken = await verifyToken(event.authorizationToken)
    logger.info('User was authorized', jwtToken)

    return {
      principalId: jwtToken.sub,
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Allow',
            Resource: '*'
          }
        ]
      }
    }
  } catch (e) {
    logger.error('User not authorized', { error: e.message })

    return {
      principalId: 'user',
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Deny',
            Resource: '*'
          }
        ]
      }
    }
  }
}

async function verifyToken(authHeader: string): Promise<JwtPayload> {
  const token = getToken(authHeader)
  const jwt: Jwt = decode(token, { complete: true }) as Jwt

  // TODO: Implement token verification
  // You should implement it similarly to how it was implemented for the exercise for the lesson 5
  // You can read more about how to do this here: https://auth0.com/blog/navigating-rs256-and-jwks/
  if(jwt.header.alg !== 'RS256'){
    throw new Error('[1]Invalid authentication header')
  }

  if(cert){
    return verify(token,cert,{algorithms:['RS256']}) as JwtPayload
  }

  const keyId = jwt.header.kid
  const jwks = await Axios.get(jwksUrl)
  const keys = jwks.data.keys

  if(!keys || keys.length < 1){
    throw new Error('[2]Invalid authentication header')
  }
  
  const filteredKeys = keys.filter(key => 
    key.use === 'sig'
    && key.kty === 'RSA'
    && key.alg === 'RS256'
    && key.kid === keyId
    && ((key.n && key.e) || (key.x5c && key.x5c.length))
  )

  if(keys.length < 0){
    throw new Error('[3]Invalid authentication header')
    
  }

  const authKeys = filteredKeys[0].x5c[0]
  cert = `-----BEGIN CERTIFICATE-----\n${authKeys.match(/.{1,64}/g).join('\n')}\n-----END CERTIFICATE-----\n`

  return verify(token,cert,{algorithms:['RS256']}) as JwtPayload
}

function getToken(authHeader: string): string {
  if (!authHeader) throw new Error('No authentication header')

  if (!authHeader.toLowerCase().startsWith('bearer '))
    throw new Error('Invalid authentication header')

  const split = authHeader.split(' ')
  const token = split[1]

  return token
}
