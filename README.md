#GraphQL Server on AWS Lambda

This is a proof of concept demonstration of a GraphQL server on AWS Lambda.

## Built Using
- Apollo Server https://github.com/apollostack/apollo-server
- Serverless https://github.com/serverless/serverless
  - Easier deployment to AWS 
- Serverless-Webpack https://github.com/elastic-coders/serverless-webpack
  - Integrates webpack and babel into packaging process of Serverless
  - Supports running the Lambda function locally
  
## Lambda Integration Module
The integration module 'lambdaApollo' is based on the Express version in Apollo Server. An example of its usage can be seen within 'handler.js'.

The following lines are required
```javascript
import {apolloLambda} from './lambdaApollo'
const apolloServer = apolloLambda({schema: schema})
const response     = apolloServer(event)
```
- where event is a json object with two properties
  - method which currently only supports 'POST'
  - body   which holds the GraphQL query as a json object
- schema which is a GraphQLSchema from the 'graphql' library 
- the returned response is a promise


