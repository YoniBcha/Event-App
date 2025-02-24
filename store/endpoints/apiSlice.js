import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { authEndpoints } from "./authEndpoints";
import { eventTypeEndpoints } from "./eventTypeEndpoint";
import { chooseDesignsEndpoints } from "./chooseDesignsEndpoints";
import { ChoosePackageEndpoints } from "./choosePackageEndpoints";
import { themeEndpoints } from "./themeEndpoints";
import { packageDetail } from "./packageDetail";
import { chooseAdditionalEndpoints } from "./chooseAdditionalEndpoints";
import { getExtraServiceEndpoint } from "./getExtraServiceEndpoint";
import { contactUsEndpoints } from "./constactus";
import { bookEventEndpoints } from "./bookEventEndpoints";
import { getSelfBookedEventsEndpoints } from "./getSelfBookedEventsEndpoints"; // ✅ Import the new API

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://eventapp-back-cr86.onrender.com/api/v1",
    credentials: "include",
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.token;
      const csrf_token = getState().auth.csrf_token;
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      if (csrf_token) {
        headers.set("X-CSRF-TOKEN", csrf_token);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    ...authEndpoints(builder),
    ...eventTypeEndpoints(builder),
    ...chooseDesignsEndpoints(builder),
    ...ChoosePackageEndpoints(builder),
    ...themeEndpoints(builder),
    ...packageDetail(builder),
    ...chooseAdditionalEndpoints(builder),
    ...getExtraServiceEndpoint(builder),
    ...contactUsEndpoints(builder),
    ...bookEventEndpoints(builder),
    ...getSelfBookedEventsEndpoints(builder), // ✅ Added new API endpoint
  }),
  refetchOnMountOrArgChange: true,
  keepUnusedDataFor: 30,
});

export const {
  useLoginUserMutation,
  useRegisterUserMutation,
  useSendVerificationCodeMutation,
  useVerifyUserMutation,
  useGetEventTypesQuery,
  useGetChooseDesignsQuery,
  useGetPackageQuery,
  useGetThemeColorQuery,
  useGetPackageDetailQuery,
  useGetAdditionalEndpointsQuery,
  useGetExtraServiceQuery,
  useContactUsMutation,
  useGetDancerQuery,
  useGetOrganizerQuery,
  useGetDjQuery,
  useBookEventMutation,
  useGetSelfBookedEventsQuery,
  useLogoutUserMutation,
} = apiSlice;
