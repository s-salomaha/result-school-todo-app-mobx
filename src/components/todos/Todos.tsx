import {useEffect, useState} from "react";
import { ITodo } from "../../types/todo";
import { Logout } from "../auth/Logout";
import { CreateTodo } from "./CreateTodo";
import { EditTodo } from "./EditTodo";
import { Todo } from "./Todo";
import {todoStore} from "../../store/todoStore";
import {observer} from "mobx-react-lite";

export const Todos = observer(() => {
    const [create, setCreate] = useState(true);
    const [id, setId] = useState('');
    const todos = todoStore.todo

    useEffect(() => {
        todoStore.get()
    }, [])

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
})
