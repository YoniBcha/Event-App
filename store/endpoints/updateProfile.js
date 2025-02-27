export const updateProfileEndpoints = (builder) => ({
  updateProfile: builder.mutation({
    query: (contactData) => ({
      url: "user/updateProfile",
      method: "POST",
      body: contactData,
    }),
  }),
});
