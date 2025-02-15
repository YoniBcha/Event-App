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
      url: "user/register",
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

  sendVerificationCode: builder.mutation({
    query: (phoneNumber) => ({
      url: "user/sendVerificationCode",
      method: "POST",
      body: { phoneNumber },
    }),
  }),

  verifyUser: builder.mutation({
    query: (data) => ({
      url: "user/verifyUser",
      method: "POST",
      body: data, 
    }),
  }),
});
