export const eventTypeEndpoints = (builder) => ({
    getEventTypes: builder.query({
      query: () => ({
        url: "event/getEventTypes", 
        method: "GET",
      }),
    }),
  });