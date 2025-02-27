export const userEndpoints = (builder) => ({
  getUserInfo: builder.query({
    query: () => ({
      url: "user/getUserInfo",
      method: "GET",
    }),
  }),
});
