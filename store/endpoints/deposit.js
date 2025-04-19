export const depositeEndpoints = (builder) => ({
  deposite: builder.mutation({
    query: (credentials) => ({
      url: "event/deposit",
      method: "POST",
      body: credentials,
    }),
  }),
});
