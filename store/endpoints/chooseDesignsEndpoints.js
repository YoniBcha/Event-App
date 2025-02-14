export const chooseDesignsEndpoints = (builder) => ({
  getChooseDesigns: builder.query({
    query: (id) => ({
      url: `/event/getEventTypes?id=${id}`, // ✅ Ensure correct API format
      method: "GET",
    }),
  }),
});
