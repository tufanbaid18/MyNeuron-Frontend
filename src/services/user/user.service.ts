import { API_ROUTES } from "../../constants/api.routes";
import axiosInstance from "../../lib/axiosInstance";

/*========================= Personal Details ============================*/
export const getPersonalDetail = async () => {
  const res = await axiosInstance.get(API_ROUTES.GET_USER_PERSONAL_PROFILE);
  return res.data;
};

export const updatePersonalDetail = async (data: unknown) => {
  const res = await axiosInstance.patch(
    API_ROUTES.UPDATE_USER_PERSONAL_PROFILE,
    data,
  );
  return res.data;
};

/* =================================================
   💼 PROFESSIONAL DETAILS (Current)
================================================= */

export const getProfessionalDetail = async () => {
  const res = await axiosInstance.get(API_ROUTES.GET_USER_PROFESSIONAL_PROFILE);
  return res.data;
};

export const updateProfessionalDetail = async (data: unknown) => {
  const res = await axiosInstance.patch(
    API_ROUTES.UPDATE_USER_PROFESSIONAL_PROFILE,
    data,
  );
  return res.data;
};

/* =================================================
   🎓 EDUCATION
================================================= */

export const getEducationList = async () => {
  const res = await axiosInstance.get(API_ROUTES.GET_USER_EDUCATION);
  return res.data;
};

export const addEducation = async (data: unknown) => {
  const res = await axiosInstance.post(API_ROUTES.ADD_USER_EDUCATION, data);
  return res.data;
};

export const updateEducation = async ({
  id,
  data,
}: {
  id: number;
  data: unknown;
}) => {
  const res = await axiosInstance.patch(
    API_ROUTES.UPDATE_USER_EDUCATION(id),
    data,
  );
  return res.data;
};

export const deleteEducation = async (id: number) => {
  const res = await axiosInstance.delete(API_ROUTES.DELETE_USER_EDUCATION(id));
  return res.data;
};

/* =================================================
   🔬 SCIENTIFIC INTEREST
================================================= */

export const getScientificInterest = async () => {
  const res = await axiosInstance.get("/profile/scientific-interest/");
  return res.data;
};

export const updateScientificInterest = async (data: unknown) => {
  const res = await axiosInstance.patch(
    "/profile/scientific-interest/update/",
    data,
  );
  return res.data;
};

/* =================================================
   🖼 PROFILE IMAGE
================================================= */

export const uploadProfileImage = async (formData: FormData) => {
  const res = await axiosInstance.post("/upload-profile-image/", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};

export const publicUserSearch = async (query: string) => {
  const res = await axiosInstance.get(API_ROUTES.USER_SEARCH(query));
  return res.data;
};

export const publicUserSearchById = async (id: number) => {
  const res = await axiosInstance.get(API_ROUTES.GET_SEARCH_USER_BY_ID(id));
  return res.data;
};

export const sendFollowRequest = async (id: number) => {
  const res = await axiosInstance.post(API_ROUTES.PUBLIC_USER_FOLLOW_REQUESTS, {
    following: id,
  });
  return res.data;
};

export const getMyFollowing = async () => {
  const res = await axiosInstance.get(API_ROUTES.MY_FOLLOWING);
  return res.data;
};

export const acceptFollowRequest = async (requestId: number) => {
  const res = await axiosInstance.post(
    API_ROUTES.FOLLOW_REQUEST_ACCEPTED(requestId),
  );
  return res.data;
};

export const rejectFollowRequest = async (requestId: number) => {
  const res = await axiosInstance.post(
    API_ROUTES.FOLLOW_REQUEST_REJECTED(requestId),
  );
  return res.data;
};

export const getMyFollowers = async (userId: number) => {
  const res = await axiosInstance.get(API_ROUTES.GET_FOLLOWERS(userId));
  return res.data;
};

export const outgoingFollowRequests = async () => {
  const res = await axiosInstance.get(API_ROUTES.OUTGOING_FOLLOW_REQUESTS);
  return res.data;
};

export const incomingFollowRequests = async () => {
  const res = await axiosInstance.get(API_ROUTES.INCOMING_FOLLOW_REQUESTS);
  return res.data;
};

