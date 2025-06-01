import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Create our API with RTK Query
export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ 
    baseUrl: 'http://localhost:5000/api',
    prepareHeaders: (headers, { getState }) => {
      // Get token from auth state
      const token = getState().auth.token;
      
      // If we have a token, add it to the headers
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      
      return headers;
    },
    credentials: 'include', // This allows the browser to send cookies with the request
  }),
  tagTypes: ['Product', 'Category', 'User', 'Order', 'Banner', 'Review', 'Settings', 'Stats'],
  endpoints: (builder) => ({
    // Auth endpoints
    login: builder.mutation({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
    }),
    register: builder.mutation({
      query: (userData) => ({
        url: '/auth/register',
        method: 'POST',
        body: userData,
      }),
    }),
    logout: builder.mutation({
      query: () => ({
        url: '/auth/logout',
        method: 'POST',
      }),
    }),
    forgotPassword: builder.mutation({
      query: (email) => ({
        url: '/auth/forgot-password',
        method: 'POST',
        body: { email },
      }),
    }),
    resetPassword: builder.mutation({
      query: ({ token, password }) => ({
        url: `/auth/reset-password/${token}`,
        method: 'PUT',
        body: { password },
      }),
    }),
    
    // User endpoints
    getMe: builder.query({
      query: () => '/auth/me',
      transformResponse: (response) => {
        // Server returns user data in a 'data' property
        return response.data || {};
      },
      providesTags: ['User'],
    }),
    updateProfile: builder.mutation({
      query: (userData) => ({
        url: '/users/profile/update',
        method: 'PUT',
        body: userData,
      }),
      invalidatesTags: ['User'],
    }),
    updatePassword: builder.mutation({
      query: (passwords) => ({
        url: '/users/profile/password',
        method: 'PUT',
        body: passwords,
      }),
    }),
    addAddress: builder.mutation({
      query: (address) => ({
        url: '/users/profile/update',
        method: 'PUT',
        body: { 
          address
        },
      }),
      invalidatesTags: ['User'],
    }),
    updateAddress: builder.mutation({
      query: ({ id, ...addressData }) => ({
        url: '/users/profile/update',
        method: 'PUT',
        body: { 
          addressId: id,
          addressData
        },
      }),
      invalidatesTags: ['User'],
    }),
    deleteAddress: builder.mutation({
      query: (id) => ({
        url: '/users/profile/update',
        method: 'PUT',
        body: { 
          removeAddressId: id 
        },
      }),
      invalidatesTags: ['User'],
    }),
    
    // Product endpoints
    getProducts: builder.query({
      query: (params) => ({
        url: '/products',
        params,
      }),
      transformResponse: (response) => {
        // Transform the response to match the expected structure in components
        return {
          products: response.data || [],
          totalPages: response.totalPages || 1,
          pagination: response.pagination || {},
          categories: response.categories || []
        };
      },
      providesTags: (result) =>
        result && result.products
          ? [
              ...result.products.map(({ _id }) => ({ type: 'Product', id: _id })),
              { type: 'Product', id: 'LIST' },
            ]
          : [{ type: 'Product', id: 'LIST' }],
    }),
    getProduct: builder.query({
      query: (slug) => `/products/${slug}`,
      transformResponse: (response) => {
        // Transform the response to match the expected structure in components
        // The server returns the product in the 'data' property, but the component expects it directly
        return response.data || response;
      },
      providesTags: (result, error, slug) => [{ type: 'Product', id: slug }],
    }),
    getProductById: builder.query({
      query: (id) => `/products/id/${id}`,
      transformResponse: (response) => {
        // Transform the response to match the expected structure in components
        // The server returns the product in the 'data' property, but the component expects it directly
        return response.data || response;
      },
      providesTags: (result, error, id) => [{ type: 'Product', id }],
    }),
    getFeaturedProducts: builder.query({
      query: () => '/products/featured',
      providesTags: [{ type: 'Product', id: 'FEATURED' }],
    }),
    getNewArrivals: builder.query({
      query: () => '/products/new-arrivals',
      providesTags: [{ type: 'Product', id: 'NEW' }],
    }),
    getBestSellers: builder.query({
      query: () => '/products/best-sellers',
      providesTags: [{ type: 'Product', id: 'BESTSELLERS' }],
    }),
    createProduct: builder.mutation({
      query: (product) => ({
        url: '/products',
        method: 'POST',
        body: product,
      }),
      invalidatesTags: [{ type: 'Product', id: 'LIST' }, 'Categories'],
      transformResponse: (response) => {
        if (!response) return { success: false, data: null };
        return {
          success: response.success !== false,
          data: response.data || response.product || response,
          message: response.message || 'Product created successfully'
        };
      },
    }),
    updateProduct: builder.mutation({
      query: ({ id, ...productData }) => ({
        url: `/products/${id}`,
        method: 'PUT',
        body: productData,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Product', id },
        { type: 'Product', id: 'LIST' },
      ],
    }),
    deleteProduct: builder.mutation({
      query: (id) => ({
        url: `/products/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Product', id: 'LIST' }],
    }),
    uploadProductImages: builder.mutation({
      query: ({ productId, formData }) => {
        // For new products, use a general upload endpoint
        if (!productId) {
          return {
            url: '/upload/images',  // Use the upload route instead of products route
            method: 'POST',
            body: formData,
            formData: true,  // This tells RTK Query this is a FormData object
            // Add proper headers for multipart/form-data
            prepareHeaders: (headers) => {
              // Don't set Content-Type when sending FormData
              // The browser will set it with the correct boundary
              headers.delete('Content-Type');
              return headers;
            },
          };
        }
        
        // For existing products, use the product-specific endpoint
        return {
          url: `/products/${productId}/images`,
          method: 'POST',
          body: formData,
          formData: true,
          // Add proper headers for multipart/form-data
          prepareHeaders: (headers) => {
            // Don't set Content-Type when sending FormData
            // The browser will set it with the correct boundary
            headers.delete('Content-Type');
            return headers;
          },
        };
      },
      invalidatesTags: (result, error, { productId }) => [
        productId ? { type: 'Product', id: productId } : { type: 'Product', id: 'LIST' },
        { type: 'Product', id: 'LIST' }
      ],
      // Add error handling for debugging upload issues
      onError: (error, variables, context) => {
        console.error('Image upload error:', error);
        return error;
      }
    }),
    createReview: builder.mutation({
      query: ({ productId, ...reviewData }) => ({
        url: `/products/${productId}/reviews`,
        method: 'POST',
        body: reviewData,
      }),
      invalidatesTags: (result, error, { productId }) => [
        { type: 'Product', id: productId },
        { type: 'Review', id: productId },
      ],
    }),
    // Cloudinary image upload endpoints
    uploadProductImages: builder.mutation({
      query: (formData) => ({
        url: '/products/images',
        method: 'POST',
        body: formData,
        formData: true, // This ensures the body is sent as FormData
      }),
    }),
    uploadCategoryImage: builder.mutation({
      query: ({ categoryId, formData }) => ({
        url: `/categories/${categoryId}/image`,
        method: 'POST',
        body: formData,
        formData: true,
      }),
      invalidatesTags: (result, error, { categoryId }) => [
        { type: 'Category', id: categoryId },
        { type: 'Category', id: 'LIST' },
      ],
    }),
    uploadBannerImage: builder.mutation({
      query: ({ bannerId, formData }) => ({
        url: `/banners/${bannerId}/image`,
        method: 'POST',
        body: formData,
        formData: true,
      }),
      invalidatesTags: (result, error, { bannerId }) => [
        { type: 'Banner', id: bannerId },
        { type: 'Banner', id: 'LIST' },
      ],
    }),
    uploadUserAvatar: builder.mutation({
      query: (formData) => ({
        url: '/users/profile/avatar',
        method: 'POST',
        body: formData,
        formData: true,
      }),
      invalidatesTags: ['User'],
    }),
    
    // Category endpoints
    getCategories: builder.query({
      query: () => '/categories',
      transformResponse: (response) => {
        // If the response has a data property containing the categories array, return that
        // Otherwise, return the response directly if it's already an array
        return response.data || response;
      },
      providesTags: (result) =>
        result && Array.isArray(result)
          ? [
              ...result.map(({ _id }) => ({ type: 'Category', id: _id })),
              { type: 'Category', id: 'LIST' },
            ]
          : [{ type: 'Category', id: 'LIST' }],
    }),
    getCategory: builder.query({
      query: (slug) => `/categories/${slug}`,
      providesTags: (result, error, slug) => [{ type: 'Category', id: slug }],
    }),
    getFeaturedCategories: builder.query({
      query: () => '/categories/featured',
      providesTags: [{ type: 'Category', id: 'FEATURED' }],
    }),
    createCategory: builder.mutation({
      query: (categoryData) => ({
        url: '/categories',
        method: 'POST',
        body: categoryData,
      }),
      invalidatesTags: [{ type: 'Category', id: 'LIST' }],
    }),
    updateCategory: builder.mutation({
      query: ({ id, ...categoryData }) => ({
        url: `/categories/${id}`,
        method: 'PUT',
        body: categoryData,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Category', id },
        { type: 'Category', id: 'LIST' },
      ],
    }),
    deleteCategory: builder.mutation({
      query: (id) => ({
        url: `/categories/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Category', id: 'LIST' }],
    }),
    uploadCategoryImage: builder.mutation({
      query: (formData) => ({
        url: '/categories/upload',
        method: 'POST',
        body: formData,
        prepareHeaders: (headers) => {
          // Don't set Content-Type when sending FormData
          // The browser will set it with the correct boundary
          return headers;
        },
      }),
      invalidatesTags: [{ type: 'Category', id: 'LIST' }],
    }),
    
    // Order endpoints
    createOrder: builder.mutation({
      query: (orderData) => ({
        url: '/orders',
        method: 'POST',
        body: orderData,
      }),
      invalidatesTags: [{ type: 'Order', id: 'LIST' }],
    }),
    getOrders: builder.query({
      query: (params) => ({
        url: '/orders',
        params,
      }),
      transformResponse: (response) => ({
        orders: response.data || [],
        totalPages: response.totalPages || 1,
        pagination: response.pagination || {},
        totalOrders: response.count || 0
      }),
      providesTags: (result) =>
        result && result.orders && Array.isArray(result.orders)
          ? [
              ...result.orders.map(({ _id }) => ({ type: 'Order', id: _id })),
              { type: 'Order', id: 'LIST' },
            ]
          : [{ type: 'Order', id: 'LIST' }],
    }),
    getOrder: builder.query({
      query: (id) => `/orders/${id}`,
      providesTags: (result, error, id) => [{ type: 'Order', id }],
      transformResponse: (response, meta, arg) => {
        // If the response is valid, return it
        if (response && (response.data || response._id)) {
          return response.data || response;
        }
        
        // If there's an error or empty response, return a fallback order structure
        // with enough data to render the success page
        return {
          _id: arg, // Use the orderId from the argument
          createdAt: new Date().toISOString(),
          status: 'Processing',
          // Include minimal fallback data
          fallbackData: true
        };
      }
    }),
    updateOrderStatus: builder.mutation({
      query: ({ id, status, note }) => ({
        url: `/orders/${id}/status`,
        method: 'PUT',
        body: { status, note },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Order', id },
        { type: 'Order', id: 'LIST' },
      ],
    }),
    cancelOrder: builder.mutation({
      query: ({ id, reason }) => ({
        url: `/orders/${id}/cancel`,
        method: 'PUT',
        body: { reason },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Order', id },
        { type: 'Order', id: 'LIST' },
      ],
    }),
    
    // Banner endpoints
    getBanners: builder.query({
      query: () => '/banners',
      transformResponse: (response) => {
        // Transform the response to match the expected structure in AdminBannersPage
        // The component expects data to be either in response.banners or directly in response
        return {
          banners: response.data || [],
          count: response.count || 0
        };
      },
      providesTags: (result) =>
        result && Array.isArray(result)
          ? [
              ...result.map(({ _id }) => ({ type: 'Banner', id: _id })),
              { type: 'Banner', id: 'LIST' },
            ]
          : result && result.banners && Array.isArray(result.banners)
            ? [
                ...result.banners.map(({ _id }) => ({ type: 'Banner', id: _id })),
                { type: 'Banner', id: 'LIST' },
              ]
            : [{ type: 'Banner', id: 'LIST' }],
    }),
    getActiveBanners: builder.query({
      query: () => '/banners/active',
      providesTags: [{ type: 'Banner', id: 'ACTIVE' }],
    }),
    getBanner: builder.query({
      query: (id) => `/banners/${id}`,
      providesTags: (result, error, id) => [{ type: 'Banner', id }],
    }),
    createBanner: builder.mutation({
      query: (bannerData) => ({
        url: '/banners',
        method: 'POST',
        body: bannerData,
      }),
      invalidatesTags: [
        { type: 'Banner', id: 'LIST' },
        { type: 'Banner', id: 'ACTIVE' },
      ],
    }),
    updateBanner: builder.mutation({
      query: ({ id, ...bannerData }) => ({
        url: `/banners/${id}`,
        method: 'PUT',
        body: bannerData,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Banner', id },
        { type: 'Banner', id: 'LIST' },
        { type: 'Banner', id: 'ACTIVE' },
      ],
    }),
    deleteBanner: builder.mutation({
      query: (id) => ({
        url: `/banners/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [
        { type: 'Banner', id: 'LIST' },
        { type: 'Banner', id: 'ACTIVE' },
      ],
    }),
    
    // Admin endpoints
    getDashboardStats: builder.query({
      query: () => '/admin/dashboard',
      transformResponse: (response) => {
        // Transform the response to handle potential data structure mismatch
        // Some endpoints return data in a 'data' property, others return it directly
        return response.data || response;
      },
      providesTags: ['Stats'],
    }),
    getUsers: builder.query({
      query: (params) => ({
        url: '/users',
        params,
      }),
      transformResponse: (response, meta, arg) => {
        // Transform the response to match the expected structure in AdminUsersPage
        const limit = arg?.limit || 10;
        return {
          users: response.data || [],
          totalUsers: response.count || 0,
          totalPages: Math.ceil((response.count || 0) / limit),
          adminCount: response.data ? response.data.filter(user => user.role === 'admin').length : 0,
          newUsersCount: response.newUsersCount || 0
        };
      },
      providesTags: ['User'],
    }),
    getUser: builder.query({
      query: (id) => `/admin/users/${id}`,
      providesTags: (result, error, id) => [{ type: 'User', id }],
    }),
    updateUser: builder.mutation({
      query: ({ id, ...userData }) => ({
        url: `/admin/users/${id}`,
        method: 'PUT',
        body: userData,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'User', id },
        'User',
      ],
    }),
    updateUserRole: builder.mutation({
      query: ({ id, role }) => ({
        url: `/admin/users/${id}/role`,
        method: 'PUT',
        body: { role },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'User', id },
        'User',
      ],
    }),
    deleteUser: builder.mutation({
      query: (id) => ({
        url: `/users/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['User'],
    }),
    getSettings: builder.query({
      query: () => '/settings',
      transformResponse: (response) => {
        // Transform the response to match the expected structure
        // Handling both direct response and response.data patterns
        return response.data || response;
      },
      providesTags: ['Settings'],
    }),
    updateSettings: builder.mutation({
      query: (settingsData) => ({
        url: '/settings',
        method: 'PUT',
        body: settingsData,
      }),
      invalidatesTags: ['Settings'],
    }),
  }),
});

// Export hooks for usage in components
export const {
  // Auth hooks
  useLoginMutation,
  useRegisterMutation,
  useLogoutMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  
  // User hooks
  useGetMeQuery,
  useUpdateProfileMutation,
  useUpdatePasswordMutation,
  useAddAddressMutation,
  useUpdateAddressMutation,
  useDeleteAddressMutation,
  
  // Product hooks
  useGetProductsQuery,
  useGetProductQuery,
  useGetProductByIdQuery,
  useGetFeaturedProductsQuery,
  useGetNewArrivalsQuery,
  useGetBestSellersQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useUploadProductImagesMutation,
  useCreateReviewMutation,
  
  // Category hooks
  useGetCategoriesQuery,
  useGetCategoryQuery,
  useGetFeaturedCategoriesQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
  useUploadCategoryImageMutation,
  
  // Order hooks
  useCreateOrderMutation,
  useGetOrdersQuery,
  useGetOrderQuery,
  useUpdateOrderStatusMutation,
  useCancelOrderMutation,
  
  // Banner hooks
  useGetBannersQuery,
  useGetActiveBannersQuery,
  useGetBannerQuery,
  useCreateBannerMutation,
  useUpdateBannerMutation,
  useDeleteBannerMutation,
  useUploadBannerImageMutation,
  
  // Admin hooks
  useGetDashboardStatsQuery,
  useGetUsersQuery,
  useGetUserQuery,
  useUpdateUserMutation,
  useUpdateUserRoleMutation,
  useDeleteUserMutation,
  // Settings hooks
  useGetSettingsQuery,
  useUpdateSettingsMutation,
} = apiSlice;
