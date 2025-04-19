export const getMyDepositEndpoints = (builder) => ({
  getMyDeposit: builder.query({
    query: ({ sort, size, page }) => ({
      url: `event/getSelfBookedEvents?sortOrder=${sort}&size=${size}&page=${page}`,
      method: "GET",
    }),
  }),
});
