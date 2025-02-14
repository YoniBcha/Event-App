export const ChoosePackageEndpoints = (builder) => ({
  getPackage: builder.query({
    query: () => ({
      url: "event/getEventPackageAdditions",
      method: "GET",
    }),
  }),
});
