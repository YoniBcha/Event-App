export const getSingleSelfBookedEventsEndpoints = (builder) => ({
  getSingleSelfBookedEvents: builder.query({
    query: (id) => ({
      url: `event/getSelfBookedEvents/${id}`, // Include the ID in the URL
      method: "GET",
    }),
  }),
});
