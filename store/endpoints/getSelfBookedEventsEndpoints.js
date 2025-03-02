export const getSelfBookedEventsEndpoints = (builder) => ({
  getSelfBookedEvents: builder.query({
    query: ({ status, sort }) => ({
      url: `event/getSelfBookedEvents?orderStatus=${status}&sortOrder=${sort}`,
      method: "GET",
    }),
  }),
});
