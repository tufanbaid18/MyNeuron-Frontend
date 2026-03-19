import React from "react";
import { userProfileRoute } from "../../routes/user.routes";
import UserProfileManager from "../../components/user/ProfileBuilder/UserProfileManager";

const UserProfile: React.FC = () => {
  // If there's a specific user ID being looked up, this component might need to switch 
  // between a 'Me' view (which has edit controls) vs a 'Public' view (read-only).
  // For now, based on the requirements to build the Update & View module, we render the Manager.
  const search = userProfileRoute.useSearch();
  const userId = search.userId;

  // The UserProfileManager contains the forms and data hooks.
  return (
    <>
      {userId ? (
        // For demonstration, if searching for another user, you'd show a public view.
        // Currently, our UserProfileManager uses the authenticated user hooks.
        <UserProfileManager mode="profile" />
      ) : (
        <UserProfileManager mode="profile" />
      )}
    </>
  );
};

export default UserProfile;
