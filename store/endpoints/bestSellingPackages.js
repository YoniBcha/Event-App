export const bestSellingPackages = (builder) => ({
  getBestSellingPackages: builder.query({
    query: () => ({
      url: "event/most-ordered-packages",
      method: "GET",
    }),
  }),
});
