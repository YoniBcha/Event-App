export const getSingleDesignGalleryEndpoints = (builder) => ({
  getSingleDesignGallery: builder.query({
    query: ({ id, designId }) => ({
      url: `event/getDesignsGallery?id=${id}&designId=${designId}`, // Include the ID in the URL
      method: "GET",
    }),
  }),
});
