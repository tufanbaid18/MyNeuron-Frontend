import { useParams } from "@tanstack/react-router";
import { useUserSearchById } from "../../hooks/user/useUserProfile";
import ErrorComponent from "../ui/ErrorComponent";
import Loading from "../ui/Loading";

const PublicUserInfo = () => {
  const { userId } = useParams({ strict: false });
  const { data: user, isLoading, error } = useUserSearchById(userId);
  if (isLoading) return <Loading />;
  if (error) return <ErrorComponent />;

  console.log("user", user);

  const fullName = `${user?.title ? user.title + " " : ""}${user?.first_name} ${user?.last_name}`;

  return (
    <div className="bg-gray-500 w-full h-full">
      <p>{user?.profile_image}</p>
      <p>{fullName}</p>
      <p>{user?.profile_title}</p>
      <p>{user?.personal_detail?.biosketch}</p>
      <p>{user?.personal_detail?.city}</p>
      <p>{user?.personal_detail?.country}</p>
      <p>{user?.professional_detail?.current_role}</p>
      <p>{user?.professional_detail?.current_organization}</p>
      <p>{user?.professional_detail?.current_description}</p>
      <p>{user?.professional_detail?.skill_set}</p>
      <p>{user?.education?.map((edu) => edu.degree)}</p>
      <p>{user?.education?.map((edu) => edu.institute)}</p>
      <p>{user?.education?.map((edu) => edu.start_year)}</p>
      <p>{user?.education?.map((edu) => edu.end_year)}</p>
      <p>{user?.scientific_interest?.major_focus}</p>
      <p>{user?.scientific_interest?.brief_description}</p>
      <p>{user?.registered_events?.map((event) => event.event_name)}</p>
      <p>{user?.registered_events?.map((event) => event.payment_status)}</p>
    </div>
  );
};

export default PublicUserInfo;
