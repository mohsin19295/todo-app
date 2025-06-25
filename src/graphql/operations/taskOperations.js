import {gql} from "@apollo/client"

export const GET_TASKS = gql`
    query GetTasks{
        getTasks{
            id,
            title,
            description,
            status,
            priority,
            dueDate,
            assignee
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
            dueDate,
            assignee
        }
    }
`;

export const ADD_TASK = gql`
    mutation AddTask(
        $title: String!, 
        $description: String, 
        $status: String!, 
        $priority: String!, 
        $dueDate: String, 
        $assignee: String
        ){
        addTask(
            title: $title,
            description: $description,
            status: $status,
            priority: $priority,
            dueDate: $dueDate,
            assignee: $assignee
        ){
            id,
            title,
            description,
            status,
            priority,
            dueDate,
            assignee
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
        $dueDate: String, 
        $assignee: String 
    ){
        updateTask(
            title: $title, 
            description: $description, 
            status: $status, 
            priority: $priority, 
            dueDate: $dueDate, 
            assignee: $assignee
        ){
            id,
            title,
            description,
            status,
            priority,
            dueDate,
            assignee
        }
    }
`

export const DELETE_TASK = gql`
    mutation DeleteTask($id: ID!){
        deleteTask(id: $id)
    }
`