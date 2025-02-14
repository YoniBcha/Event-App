export const authEndpoints = (builder) => ({
  loginUser: builder.mutation({
    query: (credentials) => ({
      url: "login",
      method: "POST",
      body: credentials,
    }),
  }),

  registerUser: builder.mutation({
    query: (userData) => ({
      url: "register",
      method: "POST",
      body: userData,
    }),
  }),

  forgotPassword: builder.mutation({
    query: (email) => ({
      url: "forgot_password",
      method: "POST",
      body: { email },
    }),
  }),

  verifyCode: builder.mutation({
    query: (codeData) => ({
      url: "verify_code",
      method: "POST",
      body: codeData,
    }),
  }),
});
