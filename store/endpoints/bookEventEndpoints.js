export const bookEventEndpoints = (builder) => ({
    bookEvent: builder.mutation({
      query: (bookingData) => ({
        url: "/event/bookEvent",
        method: "POST",
        body: bookingData,
      }),
    }),
  });
  