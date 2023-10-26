import { todoSlice } from "./slice";

export const todoReducer = todoSlice.reducer;
export const todoReducerPath = todoSlice.reducerPath;
export const todoMiddleware = todoSlice.middleware;

export const {
    useGetTodosQuery,
    useCreateTodoMutation,
    useDeleteTodoMutation,
    useEditTodoMutation,
} = todoSlice
