export const changePasswordEndpoints = (builder) => ({
  changePassword: builder.mutation({
    query: (contactData) => ({
      url: "user/changePassword",
      method: "POST",
      body: contactData,
    }),
  }),
});
