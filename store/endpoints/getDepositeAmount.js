export const getDepositAmountEndpoints = (builder) => ({
  getDepositAmount: builder.query({
    query: (id) => ({
      url: `event/getDepositAmount/${id}`,
      method: "GET",
    }),
  }),
});
