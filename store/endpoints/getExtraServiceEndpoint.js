export const getExtraServiceEndpoint = (builder) => ({
  getExtraService: builder.query({
    query: () => ({
      url: "event/getExtraServices",
      method: "GET",
    }),
  }),
});
