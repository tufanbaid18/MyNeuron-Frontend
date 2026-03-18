import { userProfileRoute } from "../../routes/user.routes";

const UserProfile = () => {
  const { userId } = userProfileRoute.useSearch();

  return <div>Profile: {userId}</div>;
};

export default UserProfile;
