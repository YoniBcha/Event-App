export const getSelfBookedEventsEndpoints = (builder) => ({
  getSelfBookedEvents: builder.query({
    query: () => ({
      url: "event/getSelfBookedEvents",
      method: "GET",
    }),
  }),
});
