export const authEndpoints = (builder) => ({
  loginUser: builder.mutation({
    query: (credentials) => ({
      url: "user/login",
      method: "POST",
      body: credentials,
    }),
  }),

  registerUser: builder.mutation({
    query: (userData) => ({
      url: "user/register",
      method: "POST",
      body: userData,
    }),
  }),

  sendVerificationCode: builder.mutation({
    query: (payload) => ({
      url: "user/sendVerificationCode",
      method: "POST",
      body: payload,
  }),}),

  verifyUser: builder.mutation({
    query: (data) => ({
      url: "user/verifyUser",
      method: "POST",
      body: data,
    }),
  }),
});