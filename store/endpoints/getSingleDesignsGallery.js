export const getSingleDesignGalleryEndpoints = (builder) => ({
  getSingleDesignGallery: builder.query({
    query: (id) => ({
      url: `event/getDesignsGallery?id=${id}`, // Include the ID in the URL
      method: "GET",
    }),
  }),
});
