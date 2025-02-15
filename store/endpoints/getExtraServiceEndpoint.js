export const getExtraServiceEndpoint = (builder) => ({
  getExtraService: builder.query({
    query: () => ({
      url: "event/getExtraServices",
      method: "GET",
    }),
  }),

  getDancer: builder.query({
    query: (id) => ({
      url: `/event/getExtraServiceProviders?id=${id}`,
      method: "GET",
    }),
  }),

  getOrganizer: builder.query({
    query: (id) => ({
      url: `/event/getExtraServiceProviders?id=${id}`,
      method: "GET",
    }),
  }),

  getDj: builder.query({
    query: (id) => ({
      url: `/event/getExtraServiceProviders?id=${id}`,
      method: "GET",
    }),
  }),
});
