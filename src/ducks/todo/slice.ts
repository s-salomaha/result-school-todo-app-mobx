import { createApi, fetchBaseQuery, retry } from '@reduxjs/toolkit/query/react'
import { isSuccessResponse, Response } from '../../types/response'
import { ITodo } from '../../types/todo'
import { refresh } from '../auth'
import { RootState } from '../store'

const retryWithRefresh = retry(
    async (args, api, extraOptions) => {
        const result = await fetchBaseQuery({
            baseUrl: 'http://localhost:3142/todos',
            prepareHeaders(headers, api) {
                const state = api.getState() as RootState;
                headers.append('authorization', `Bearer ${state.auth.accessToken}`)
            },
        })(args, api, extraOptions)

        if (result.error?.status === 403) {
            await api.dispatch(refresh())
        }

        return result;
    },
    { maxRetries: 1 }
)

export const todoSlice = createApi({
    reducerPath: 'todo',
    baseQuery: retryWithRefresh,
    tagTypes: ['todos'],
    endpoints: builder => ({
        getTodos: builder.query<Response<ITodo[]>, void>({
            query() {
                return {
                    url: '/'
                }
            },
            providesTags: ['todos']
        }),
        createTodo: builder.mutation<Response<ITodo>, ITodo['title']>({
            query: (title) => ({
                url: '/',
                method: 'POST',
                body: { title }
            }),
            async onQueryStarted(_, api) {
                const { data } = await api.queryFulfilled;

                if (isSuccessResponse(data)) {
                    api.dispatch(
                        todoSlice.util.updateQueryData(
                            'getTodos',
                            undefined,
                            (draft) => {
                                if (draft.success) {
                                    draft.data.push(
                                        data.data
                                    )
                                }
                            }
                        )
                    )
                }
            }
        }),
        editTodo: builder.mutation<Response<ITodo>, ITodo>({
            query(todo) {
                return {
                    url: `/${todo.id}`,
                    method: 'PATCH',
                    body: todo
                }
            },
            invalidatesTags: ['todos']
        }),
        deleteTodo: builder.mutation<Response<ITodo[]>, ITodo['id']>({
            query(todoId) {
                return {
                    url: `/${todoId}`,
                    method: 'DELETE',
                }
            },
            invalidatesTags: ['todos']
        })
    })
})
