import { useState } from "react";
import { useGetTodosQuery } from "../../ducks/todo";
import { ITodo } from "../../types/todo";
import { Logout } from "../auth/Logout";
import { CreateTodo } from "./CreateTodo";
import { EditTodo } from "./EditTodo";
import { Todo } from "./Todo";

export const Todos = () => {
    const [create, setCreate] = useState(true);
    const [id, setId] = useState('');
    const todoData = useGetTodosQuery();
    const todos: ITodo[] = todoData.data?.success ?
        todoData.data.data :
        [];

    const onEditHandler = (todoId: ITodo['id']) => {
        setCreate(false);
        setId(todoId);
    }

    const successfulEdit = () => {
        setCreate(true);
    }

    return (
        <div className="todos">
            <Logout />
            {create ? <CreateTodo /> : <EditTodo todoId={id} successfulEdit={successfulEdit} />}
            <section className="todos__container">
                <h1>ToDo List</h1>
                {todos.length > 0
                    ? todos.map(todo => <Todo key={todo.id} todo={todo} onEditHandler={onEditHandler} />)
                    : <p>No todos here!</p>}
            </section >
        </div >
    );
}
