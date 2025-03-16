export const preBookEventEndpoints = (builder) => ({
  preBookEvent: builder.mutation({
    query: (bookingData) => ({
      url: "/event/PreBook",
      method: "POST",
      body: bookingData,
    }),
  }),
});
