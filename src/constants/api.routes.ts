export const API_ROUTES = {
  LOGIN: "/login/",
  LOGOUT: "/logout/",
  REGISTER: "/register/",
  USER_PROFILE: "/user-profile/",
  UPDATE_USER_PROFILE: "/user-profile/update-current/",
  REFRESH_TOKEN: "/refresh-token/",
  VERIFY_EMAIL: "/verify-email/",
  RESEND_EMAIL: "/resend-verification/",
  FORGOT_PASSWORD: "/forgot-password/",
  RESET_PASSWORD: "/reset-password/",
  GET_USER_PERSONAL_PROFILE: "/profile/personal/",
  UPDATE_USER_PERSONAL_PROFILE: "/profile/personal/update/",
  GET_USER_PROFESSIONAL_PROFILE: "/profile/professional/",
  UPDATE_USER_PROFESSIONAL_PROFILE: "/profile/professional/update/",
  GET_USER_EDUCATION: "/profile/education/",
  ADD_USER_EDUCATION: "/profile/education/add/",
  UPDATE_USER_EDUCATION: (id: number) => `/profile/education/${id}/update/`,
  DELETE_USER_EDUCATION: (id: number) => `/profile/education/${id}/delete/`,

  USER_SEARCH: (query: string) => `/public/users/search/?q=${query}`,
  GET_SEARCH_USER_BY_ID: (id: number) => `/public/users/${id}/`,
  // ── GATC Payment ──
  GET_EVENTS: "/events/",
  CREATE_REGISTRATION: "/registrations/",
  CREATE_ORDER: (registrationId: number) => `/create-order/${registrationId}/`,
  VERIFY_PAYMENT: "/verify-payment/",
  MANUAL_PAYMENT: "/manual-payment/",

  // ── Bookshelf ──
  GET_FOLDERS_TREE: "/folders/tree/",
  CREATE_FOLDER: "/folders/",
  CREATE_FOLDER_ITEM: "/folder-items/",
  UPDATE_FOLDER: (id: number) => `/folders/${id}/`,
  DELETE_FOLDER: (id: number) => `/folders/${id}/`,
  UPDATE_FOLDER_ITEM: (id: number) => `/folder-items/${id}/`,
  DELETE_FOLDER_ITEM: (id: number) => `/folder-items/${id}/`,
  GATC_PASS: "/public/payment",
  GATC_PROGRAMS: "/programs/",
  GATC_SPEAKERS: "/speakers/",
  GATC_MEMBERS: "/members",
  GATC_MEMBER_BY_ID: (id: number | string) => `/members/${id}/`,

  // ── Handshake ──
  HANDSHAKE_SEND: "/handshake/send/",
  HANDSHAKE_MY: "/handshake/my_handshakes/",
  HANDSHAKE_CANCEL: (id: number) => `/handshake/${id}/cancel/`,
  HANDSHAKE_ACCEPT: (id: number) => `/handshake/${id}/accept/`,
  HANDSHAKE_DECLINE: (id: number) => `/handshake/${id}/decline/`,

  // ── Inbox / Messages ──
  CONVERSATIONS: "/conversations/",
  MESSAGES_SEND: "/messages/",
  MESSAGES_CHAT: (userId: number) => `/messages/chat/${userId}/`,
  MESSAGES_MARK_READ: (userId: number) => `/messages/mark-read/${userId}/`,
  USER_BY_ID: (userId: number) => `/users/${userId}/`,

  // ── Impulse / Posts ──
  POSTS: "/posts/",
  POST_BY_ID: (id: number) => `/posts/${id}/`,
  POST_LIKE: (id: number) => `/posts/${id}/like/`,
  POST_COMMENT: (id: number) => `/posts/${id}/comment/`,
  POST_BOOKMARK: (id: number) => `/posts/${id}/bookmark/`,
  POST_MY_LATEST: "/posts/my_latest/",
  OG_META: "/og-meta/",
  MY_ACTIVITY_OVERVIEW: "/my-activity/overview",
  PAGES: "/pages/",
  PAGES_BY_FILTER: "/pages/filter/",
  PAGE_POSTS: "/page-posts/",
  PAGES_OVERVIEW: "/pages/counts",
  NEWS: "/news/",
  PAGE_FOLLOW: "/page-follow/follow/",
  PAGE_UNFOLLOW: "/page-follow/unfollow/",

  //------- public User ---------
  PUBLIC_USER_FOLLOW_REQUESTS: "/follows/",

  //------------ MY Activity ---------------------
  MY_FOLLOWING: "follows/my-following/",
  OUTGOING_FOLLOW_REQUESTS: "follows/outgoing/",
  INCOMING_FOLLOW_REQUESTS: "follows/incoming/",
  FOLLOW_REQUEST_ACCEPTED: (requestId: number) =>
    `/follows/${requestId}/accept/`,
  FOLLOW_REQUEST_REJECTED: (requestId: number) =>
    `/follows/${requestId}/reject/`,
  GET_FOLLOWERS: (userId: number) => `/usersfollow/${userId}/followers/`,
  PUBLIC_USER_FOLLOWING: (userId: number) => `/users/${userId}/following/`,
  PAGE_DETAILS: (pageId: number) => `/pages/${pageId}/`,
  REMOVE_FOLLOWER: "/follows/remove_follower/",
  UNFOLLOW_USER: "/follows/unfollow/",
};
