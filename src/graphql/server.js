import { ApolloServer } from "@apollo/server"
import { typeDefs } from "./typeDefs"
import { resolvers } from "./resolvers"
import { startServerAndCreateNextHandler } from "@as-integrations/next"
import { dbConnet } from "@/lib/db"


const server = new ApolloServer({typeDefs, resolvers})

export const handler = startServerAndCreateNextHandler(server, {
    context: async (req, res) => {
        await dbConnet();
        return {req, res}
    }
})