import { gql } from 'graphql-tag'

export const typeDefs = gql`
    type Todo {
        id: ID!,
        title: String!,
        completed: Boolean!
    }

    type Query {
        getTodos: [Todo!]!,
        getTodo(id: ID!): Todo
    }

    type Mutation {
        addTodo(title: String!): Todo!,
        deleteTodo(id: ID!): Boolean!,
        updateTodo(id: ID!, title: String!): Todo!,
        toggleTodo(id: ID!): Todo!
    }

    type Task {
        id: ID!
        title: String!
        description: String
        status: String!
        priority: String!
        dueDate: String
        assignee: String
    }

    type Query {
        getTasks: [Task!]!
        getTask(id: ID!): Task
    }

    type Mutation {
        addTask(
            title: String!
            description: String
            status: String!
            priority: String!
            dueDate: String
            assignee: String
        ): Task!

        updateTask(
            id: ID!
            title: String!
            description: String
            status: String!
            priority: String!
            dueDate: String
            assignee: String
        ): Task!

        deleteTask(id: ID!): Boolean!
    }
`;