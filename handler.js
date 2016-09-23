import {apolloLambda} from './lambdaApollo'
import {GraphQLSchema, 
        GraphQLObjectType, 
        GraphQLInt,
        GraphQLString,
        GraphQLList,
        GraphQLNonNull,
        GraphQLID} from 'graphql/type'

const ProjectType = new GraphQLObjectType({
  name: 'ProjectType',
  fields: {
    id: {
      type: GraphQLInt
    },
    name: {
      type: GraphQLString
    }
  }
});

const RootType = new GraphQLObjectType({
  name: 'RootType',
  fields: {
    projects: {
      type: new GraphQLList(ProjectType),
      resolve() {
        return [
          {id: 1, name: `Project 1`},
          {id: 2, name: `Project 2`}
        ];
      }
    },
    project: {
      type: ProjectType,
      args: {
        id: {
          type: new GraphQLNonNull(GraphQLID)
        }
      },
      resolve(parent, {id}) {
        return {id: id, name: `Project ${id}`}
      }
    }
  }
});

const schema = new GraphQLSchema({
  query: RootType
});


export const graphql = (event, context, cb) => {
  const apolloServer = apolloLambda({schema: schema})
  const response     = apolloServer(event)

  response
  .then( r => cb(null, r))
  .catch(e => cb(e))
}