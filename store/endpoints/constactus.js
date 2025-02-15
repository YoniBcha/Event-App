export const contactUsEndpoints = (builder) => ({
    contactUs: builder.mutation({
      query: (contactData) => ({
        url: "user/contactUs",
        method: "POST",
        body: contactData,
      }),
    }),
  });