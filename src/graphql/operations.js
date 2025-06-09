import {gql} from '@apollo/client'

export const GET_TODOS = gql`
    query GetTodos {
        getTodos {
            id,
            title,
            completed
        }
    }
`;

export const GET_TODO = gql`
    query GetTodo($id: ID!){
        getTodo(id: $id) {
            id,
            title,
            completed
        }
    }
`;

export const ADD_TODO = gql`
    mutation AddTodo($title: String!){
        addTodo(title: $title){
            id,
            title,
            completed
        }
    }
`;

export const DELETE_TODO = gql`
    mutation DeleteTodo($id: ID!){
        deleteTodo(id: $id)
    }
`;

export const UPDATE_TODO = gql`
    mutation UpdateTodo($id: ID!, $title: String!){
        updatedTodo(id: $id, title: $title){
            id,
            title,
            completed
        }
    }
`;

export const TOGGLE_TODO = gql`
    mutation ToggleTodo($id: ID!){
        toggleTodo(id: $id){
            id,
            title,
            completed
        }
    }
`;