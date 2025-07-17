import {gql} from "@apollo/client"

export const GET_TASKS = gql`
    query GetTasks{
        getTasks{
            id,
            title,
            description,
            status,
            priority,
            assignee,
            dueDays
        }
    }
`;

export const GET_TASK = gql`
    query GetTask($id: ID!){
        getTask(id: $id){
            id,
            title,
            description,
            status,
            priority,
            assignee,
            dueDays
        }
    }
`;

export const ADD_TASK = gql`
    mutation AddTask(
        $title: String!, 
        $description: String, 
        $status: String!, 
        $priority: String!, 
        $assignee: String,
        $dueDays: String
        ){
        addTask(
            title: $title,
            description: $description,
            status: $status,
            priority: $priority,
            assignee: $assignee
            dueDays: $dueDays
        ){
            id,
            title,
            description,
            status,
            priority,
            assignee,
            dueDays
        }
    }
`

export const UPDATE_TASK = gql`
    mutation UpdateTask(
        $id: ID!,
        $title: String!, 
        $description: String, 
        $status: String!, 
        $priority: String!, 
        $assignee: String ,
        $dueDays: String
    ){
        updateTask(
            id: $id,
            title: $title, 
            description: $description, 
            status: $status, 
            priority: $priority, 
            assignee: $assignee,
            dueDays: $dueDays
        ){
            id,
            title,
            description,
            status,
            priority,
            assignee,
            dueDays
        }
    }
`

export const DELETE_TASK = gql`
    mutation DeleteTask($id: ID!){
        deleteTask(id: $id)
    }
`