import * as graphql from 'graphql'
import {runQuery} from 'apollo-server'
import R from 'ramda'

export function apolloLambda (options) {
	if(!options){
		throw new Error('Apollo Server requires options.')
	}

	if(arguments.length > 1){
		throw `[500] Apollo Server expects exactly one argument, got ${arguments.length}`
	}

	return async(req) => {
		let optionsObject = options
		if(isOptionsFunction(options)){
			try{
				optionsObject = await options(req)
			}catch(e){
				throw `[500] Invalid options provided to ApolloServer: ${e.message}`
			}
		}

		if (req.method !== 'POST') {
		  throw '[500] Apollo Server supports only POST requests.'
		}

		const formatErrorFn = optionsObject.formatError || graphql.formatError;

		if(!R.is(Object, req.body) || R.isEmpty(req.body)){
			throw '[400] POST body missing.'
		}

		let b = req.body

		let isBatch = true
		if (!Array.isArray(b)) {
			isBatch = false;
			b = [b];
		}

		let responses = []
		for (let requestParams of b) {
			try {
				const query = requestParams.query;
				const operationName = requestParams.operationName;
				let variables = requestParams.variables;

				if (typeof variables === 'string') {
					try {
						variables = JSON.parse(variables);
					} catch (error) {
						throw '[400] Variables are invalid JSON.'
					}
				}

				let params = {
					schema: optionsObject.schema,
					query: query,
					variables: variables,
					context: optionsObject.context,
					rootValue: optionsObject.rootValue,
					operationName: operationName,
					logFunction: optionsObject.logFunction,
					validationRules: optionsObject.validationRules,
					formatError: formatErrorFn,
					formatResponse: optionsObject.formatResponse,
					debug: optionsObject.debug,
				}

				if (optionsObject.formatParams) {
					params = optionsObject.formatParams(params);
				}

				responses.push(await runQuery(params))
			}catch(error){
				responses.push({ errors: [formatErrorFn(e)] });
			}
		}

		if(isBatch){
			return responses
		}else{
			const gglResponse = responses[0]
			if(gglResponse.errors && typeof gglResponse.data === 'undefined'){
				throw '[400]'
			}
			return gglResponse
		}
	}
}

function isOptionsFunction(arg){
  return typeof arg === 'function'
}
