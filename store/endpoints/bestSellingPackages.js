export const bestSellingPackages = (builder) => ({
  getBestSellingPackages: builder.query({
    query: () => ({
      url: "event/most-ordered-packages?limit=4",
      method: "GET",
    }),
  }),
});
