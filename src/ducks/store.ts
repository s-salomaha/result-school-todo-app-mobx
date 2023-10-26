import { combineReducers } from "redux";
import { configureStore } from '@reduxjs/toolkit';
import { authReducer } from "./auth";
import { todoMiddleware, todoReducer, todoReducerPath } from "./todo";

const rootReducer = combineReducers({
    auth: authReducer,
    [todoReducerPath]: todoReducer,
});

export const store = configureStore({
    reducer: rootReducer,
    middleware(getDefaultMiddleware) {
        return getDefaultMiddleware().concat([
            todoMiddleware
        ])
    },
})

export type RootState = ReturnType<typeof rootReducer>;
