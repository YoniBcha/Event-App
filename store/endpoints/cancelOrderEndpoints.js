export const cancelOrderEndpoints = (builder) => ({
  cancelOrder: builder.mutation({
    query: (id) => ({
      url: `event/cancelBookedEvent/${id}`, // Include the ID in the URL
      method: "POST",
    }),
  }),
});
