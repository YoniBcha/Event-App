export const getSelfBookedEventsEndpoints = (builder) => ({
  getSelfBookedEvents: builder.query({
    query: ({ status, sort,size,page }) => ({
      url: `event/getSelfBookedEvents?orderStatus=${status}&sortOrder=${sort}&size=${size}&page=${page}`,
      method: "GET",
    }),
  }),
});
