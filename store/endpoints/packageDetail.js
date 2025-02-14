export const packageDetail = (builder) => ({
  getPackageDetail: builder.query({
    query: (id) => ({
      url: `event/getEventPackage?id=${id}`,
      method: "GET",
    }),
  }),
});
