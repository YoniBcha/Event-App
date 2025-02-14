export const chooseAdditionalEndpoints = (builder) => ({
  getAdditionalEndpoints: builder.query({
    query: () => ({
      url: "event/getEventPackageAdditions",
      method: "GET",
    }),
  }),
});
