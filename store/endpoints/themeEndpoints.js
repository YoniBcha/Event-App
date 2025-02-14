export const themeEndpoints = (builder) => ({
  getThemeColor: builder.query({
    query: () => ({
      url: "theme/getThemeColor",
      method: "GET",
    }),
  }),
});
