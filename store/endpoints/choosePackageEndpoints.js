export const ChoosePackageEndpoints = (builder) => ({
  getPackage: builder.query({
    query: ({ eventDesign, eventType, place }) => ({
      url: "event/getEventPackage",
      method: "GET",
      params: { eventDesign, eventType, place }, 
    }),
  }),
});
