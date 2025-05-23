export const userEndpoints = (builder) => ({
  getUserInfo: builder.query({
    query: () => ({
      url: "user/getUserInfo",
      method: "GET",
    }),
  }),
  // Add this lazy version
  getUserInfoLazy: builder.mutation({
    query: () => ({
      url: "user/getUserInfo",
      method: "GET",
    }),
  }),
});