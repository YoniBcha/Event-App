export const ChoosePackageEndpoints = (builder) => ({
  getPackage: builder.query({
    query: () => ({
      url: "event/getEventPackage",
      method: "GET",
    }),
  }),
});
