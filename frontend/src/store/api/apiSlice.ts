import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const formApi = createApi({
  refetchOnMountOrArgChange: 20, //similar to Tanstack Query staleTime
  reducerPath: 'formApi',
  baseQuery: fetchBaseQuery({baseUrl: '/api'}),
  tagTypes: ['Forms', 'LIST'],
  endpoints: (builder) => ({
    getForms: builder.query({
      query: () => `/forms`,
      providesTags: (result) =>
        result
          ? [
              ...result.forms.map(({ id }) => ({ type: 'Forms', id })),
              { type: 'Forms', id: 'LIST' },
            ]
          : [{ type: 'Forms', id: 'LIST' }],
    }),

    getFormById: builder.query({
      query: ({id}) => `/forms/${id}`,
      providesTags: (result, error, {id}) => [{ type: 'Forms', id }],
    }),

    addForm: builder.mutation({
      query: ({ body }) => ({
        url: `/forms`,
        method: 'POST',
        body,
      }),
      invalidatesTags: [
        { type: 'Forms', id: 'LIST' }
      ],
    }),

    deleteForm: builder.mutation({
      query: ({ id }) => ({
        url: `/forms/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'Forms', id: 'LIST' },
        { type: 'Forms', id }
      ],
    }),
    editForm: builder.mutation({
      query: ({body, id}) => ({
        url: `/forms/${id}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: (result, error, {body, id}) => [
        { type: 'Forms', id: 'LIST' },
        { type: 'Forms', id }
      ],
    }),
  }),
})

export const { useGetFormsQuery, useGetFormByIdQuery, useDeleteFormMutation, useAddFormMutation, useEditFormMutation } = formApi