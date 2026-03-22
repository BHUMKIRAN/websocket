import express from "express";
import {ApolloServer} from "apollo-server-express";
import { resolvers , typeDefs} from './graphql.js'; // updated import statement
import { connectDB } from "./config.js";

connectDB;
async function server () {
    const app = express()
     
    const server = new ApolloServer({
        typeDefs,
        resolvers
    })
    await server.start()
    server.applyMiddleware({app})
    app.listen({port: 4000}, () => console.log(`Server ready at http://localhost:4000${server.graphqlPath}`))
}

server();