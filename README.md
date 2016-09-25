#GraphQL Server on AWS Lambda

This is a proof of concept demonstration of a GraphQL server on AWS Lambda.

## Built Using
- Apollo Server https://github.com/apollostack/apollo-server
- Serverless https://github.com/serverless/serverless
  - Easier deployment to AWS 
- Serverless-Webpack https://github.com/elastic-coders/serverless-webpack
  - Integrates webpack and babel into packaging process of Serverless
  - Supports running the Lambda function locally
  
## Apollo-Lambda Integration Module
The integration module provided in this package - `lambdaApollo` - is based on the Express version in Apollo Server. An example of its usage can be seen within `handler.js`.

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

## How To: Test example

Code for a simple server with a static schema is included.  To try it out on a local machine:

 - Clone the lambda-apollo-server repo
 - cd lambda-apollo-server
 - npm install
 - serverless webpack serve

...now you are running a local AWS gateway simulation with your Apollo graphql lambda listening.

query.json contains the body of an example query you can post to it:

 - ^Z
 - bg
 - curl -v -H "Content-Type: application/json" -XPOST --data @query.json http://localhost:8000/graphql

... you should see a response that matches the schema you can find in handler.js

If you have [followed the instructions for setting up deployment using serverless](https://github.com/serverless/serverless/blob/master/docs/01-guide/01-installing-serverless.md) you can deploy your lambda immediately, and test it.

 - severless deploy
 - curl -v -H "Content-Type: application/json" -XPOST --data @query.json <URL that serverless tells you!>


