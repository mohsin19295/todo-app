import { gql } from 'graphql-tag'

export const typeDefs = gql`
    type Todo {
        id: ID!,
        title: String!,
        completed: Boolean!
    }

    type Task {
        id: ID!
        title: String!
        description: String
        status: String!
        priority: String!
        assignee: String
        dueDays: String
    }

    type Query {
        getTodos: [Todo!]!,
        getTodo(id: ID!): Todo

        getTasks: [Task!]!
        getTask(id: ID!): Task
    }

    type Mutation {
        addTodo(title: String!): Todo!,
        deleteTodo(id: ID!): Boolean!,
        updateTodo(id: ID!, title: String!): Todo!,
        toggleTodo(id: ID!): Todo!

        addTask(
            title: String!
            description: String
            status: String!
            priority: String!
            assignee: String
            dueDays: String
        ): Task!

        updateTask(
            id: ID!
            title: String!
            description: String
            status: String!
            priority: String!
            assignee: String
            dueDays:  String
        ): Task!

        deleteTask(id: ID!): Boolean!
    }
`;