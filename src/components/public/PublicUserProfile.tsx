import { useParams, useRouter } from "@tanstack/react-router";
import { Avatar, Button } from "antd";
import { useAtomValue } from "jotai";
import { MapPin, Send } from "lucide-react";
import React, { useState } from "react";
import { FaLinkedin, FaXTwitter } from "react-icons/fa6";
import {
  useGetMyFollowing,
  useOutgoingFollowRequests,
  useSendFollowRequest,
  useUnfollowUser,
} from "../../hooks/impulse/useMyActivity";
import { useUserSearchById } from "../../hooks/user/useUserProfile";
import { userProfileAtom } from "../../store/auth.store";
import { FollowingStatus } from "../../types/impulse/myactivity.types";
import { getAvatarByName } from "../../utils/avatar.utils";
import ErrorComponent from "../ui/ErrorComponent";
import Loading from "../ui/Loading";
import SocialHandle from "../ui/SocialHandle";

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({
  title,
  children,
}) => (
  <div className="bg-white dark:bg-zinc-900 shadow-sm rounded-2xl p-4 sm:p-6">
    <h2 className="text-lg font-semibold border-b border-gray-200 pb-2">
      {title}
    </h2>
    <div className="text-sm text-gray-700 dark:text-gray-300 space-y-2 mt-4">
      {children}
    </div>
  </div>
);

const Label: React.FC<{ label: string; value: string | null | undefined }> = ({
  label,
  value,
}) => {
  value = value ?? "Not provided";
  return (
    <div>
      <span className="font-medium">{label}: </span>
      <span>{value}</span>
    </div>
  );
};

const getFollowButtonText = (status: string | null) => {
  if (status === FollowingStatus.PENDING) return "Requested";
  if (status === FollowingStatus.ACCEPTED) return "Unfollow";
  return "Follow";
};

const PublicUserProfile: React.FC = () => {
  const { userId } = useParams({ strict: false });
  const { data: user, isLoading, error } = useUserSearchById(userId);
  const { mutateAsync: sendFollowRequest } = useSendFollowRequest(userId);
  const [follwingStatus, setFollowingStatus] = useState<string | null>(null);

  const loggedUser = useAtomValue(userProfileAtom);
  const router = useRouter();
  const { data: outgoingRequests } = useOutgoingFollowRequests();
  const { data: myFollowing } = useGetMyFollowing();

  const unfollowUserMutation = useUnfollowUser()

  React.useEffect(() => {
    if (!user) return;

    let isFollowing = false;

    if (myFollowing) {
      const followingMatch = myFollowing.find(
        (item: any) => String(item.id) === String(userId)
      );
      
      if (followingMatch) {
        setFollowingStatus(FollowingStatus.ACCEPTED);
        isFollowing = true;
      }
    }

    if (!isFollowing && outgoingRequests) {
      const followRequest = outgoingRequests.find(
        (request) => String(request.following.id) === String(userId)
      );
      
      setFollowingStatus(followRequest?.status ?? null);
    }
  }, [outgoingRequests, user, userId, myFollowing]);



  if (isLoading) return <Loading />;
  if (error || !user) return <ErrorComponent />;

  const fullName = [
    `${user.title ? user.title + "." : ""}`,
    user.first_name,
    user.middle_name,
    user.last_name,
  ]
    .filter(Boolean)
    .join(" ");

  const handleFollowUnfollowClick = async () => {

    if(follwingStatus === FollowingStatus.ACCEPTED){
      await unfollowUserMutation.mutateAsync(Number(userId))
      setFollowingStatus(null);
      return
    }
    try {
      const response = await sendFollowRequest();
      setFollowingStatus(response.status);
   
    } catch (error) {
      console.error("Error while sending follow request: ", error);
    }
  };

  const handleMessageClick = () => {
    router.navigate({ to: `/inbox/${userId}` });
  };

  return (
    <div className="w-full h-full mx-auto p-4 sm:p-6 space-y-6 overflow-y-auto">
      {/* Header */}

      <div className="relative flex flex-col md:flex-row items-center md:items-start gap-6 lg:gap-8 bg-white dark:bg-zinc-900 shadow-sm rounded-3xl p-6 md:p-8 border border-gray-100 dark:border-zinc-800/50 overflow-hidden isolate">
        {/* Subtle header background banner */}
        <div className="absolute inset-x-0 top-0 h-32 bg-linear-to-r from-gray-50 to-gray-100 dark:from-zinc-800/50 dark:to-zinc-800/80 -z-10" />

        {/* Avatar Container */}
        <div className="relative shrink-0 -mt-2">
          <Avatar
            src={
              user.profile_image ||
              getAvatarByName({
                firstName: user.first_name,
                lastName: user.last_name,
              })
            }
            size={130}
            className="ring-[6px] ring-white dark:ring-zinc-900 shadow-md bg-white dark:bg-zinc-800"
            style={{ aspectRatio: "1 / 1" }}
          />
        </div>

        {/* Profile Info */}
        <div className="flex-1 w-full text-center md:text-left pt-2 md:pt-4 z-10">
          <div className="flex flex-col xl:flex-row xl:justify-between xl:items-start gap-6">
            {/* Primary Details */}
            <div className="space-y-3">
              <div>
                <h1 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-gray-50 tracking-tight">
                  {fullName}
                </h1>
                <h2 className="text-lg md:text-xl font-medium text-gray-600 dark:text-gray-300 mt-1">
                  {user.professional_detail?.current_role ??
                    "Role: Not provided"}
                  {user.professional_detail?.current_organization && (
                    <>
                      <span className="text-gray-300 dark:text-zinc-600 mx-2">
                        •
                      </span>
                      <span className="text-gray-500 dark:text-gray-400 font-normal">
                        {user.professional_detail?.current_organization}
                      </span>
                    </>
                  )}
                </h2>
              </div>

              {(user.personal_detail?.city ||
                user.personal_detail?.country) && (
                <div className="flex items-center justify-center md:justify-start gap-1.5 text-gray-500 dark:text-gray-400 font-medium">
                  <MapPin
                    size={18}
                    className="text-gray-400 dark:text-zinc-500 shrink-0"
                  />
                  <span>
                    {[user.personal_detail.city, user.personal_detail.country]
                      .filter(Boolean)
                      .join(", ")}
                  </span>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            {loggedUser?.id !== Number(userId) && (
              <div className="flex flex-wrap justify-center md:justify-start xl:justify-end items-center gap-3">
                <Button
                  type="primary"
                  size="large"
                  className="bg-zinc-900 hover:bg-zinc-800! dark:bg-white dark:text-zinc-900 dark:hover:bg-gray-100! border-none shadow-sm font-semibold rounded-full px-6 flex items-center justify-center h-11"
                >
                  <div
                    onClick={handleMessageClick}
                    className="flex items-center gap-2"
                  >
                    <Send size={18} />
                    <span>Message</span>
                  </div>
                </Button>

                <Button
                  onClick={handleFollowUnfollowClick}
                  disabled={follwingStatus === FollowingStatus.PENDING}
                  danger={follwingStatus === FollowingStatus.ACCEPTED}
                  size="large"
                  // loading={unfollowUserMutation.isPending}
                  className="bg-white dark:bg-zinc-900 border-gray-300 dark:border-zinc-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50! dark:hover:bg-zinc-800! shadow-sm font-semibold rounded-full px-6 h-11"
                >
                  {getFollowButtonText(follwingStatus)}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT */}
        <div className="space-y-6 lg:col-span-1">
          {/*Social */}

          {(user.personal_detail?.x_handle ||
            user.personal_detail?.linkedin) && (
            <Section title="Social">
              <div className="flex items-center gap-2">
                {user.personal_detail?.x_handle && (
                  <SocialHandle
                    icon={<FaXTwitter size={18} />}
                    href={user.personal_detail.x_handle}
                    hoverColorClass="hover:!text-black dark:hover:!text-white"
                  />
                )}
                {user.personal_detail?.linkedin && (
                  <SocialHandle
                    icon={<FaLinkedin size={18} />}
                    href={user.personal_detail.linkedin}
                    hoverColorClass="hover:!text-[#0a66c2] dark:hover:!text-[#0a66c2]"
                  />
                )}
              </div>
            </Section>
          )}
          {/* Personal */}

          <Section title="Personal">
            <Label label="Bio" value={user.personal_detail?.biosketch} />
            <Label label="City" value={user.personal_detail?.city} />
            <Label label="Country" value={user.personal_detail?.country} />
            <Label label="Gender" value={user.personal_detail?.gender} />
            <Label label="DOB" value={user.personal_detail?.dob} />
          </Section>

          {/* Scientific */}

          <Section title="Scientific Interest">
            <Label
              label="Expertise"
              value={user.scientific_interest?.research_area_of_expertise}
            />
            <Label
              label="Major Focus"
              value={user.scientific_interest?.major_focus?.join(", ")}
            />
            <Label
              label="Specific Areas"
              value={user.scientific_interest?.specific_research_areas?.join(
                ", ",
              )}
            />
            <Label
              label="Organs"
              value={user.scientific_interest?.organ_sites?.join(", ")}
            />
            <Label
              label="Additional"
              value={user.scientific_interest?.additional_research_areas?.join(
                ", ",
              )}
            />
            <Label
              label="Description"
              value={user.scientific_interest?.brief_description}
            />
          </Section>
        </div>

        {/* RIGHT */}
        <div className="space-y-6 lg:col-span-2">
          {/* Professional */}

          <Section title="Professional">
            <Label
              label="Role"
              value={user.professional_detail?.current_role}
            />
            <Label
              label="Organization"
              value={user.professional_detail?.current_organization}
            />
            <Label
              label="Department"
              value={user.professional_detail?.current_department}
            />
            <Label
              label="Description"
              value={user.professional_detail?.current_description}
            />
            <Label label="Skills" value={user.professional_detail?.skill_set} />
            <Label
              label="Languages"
              value={user.professional_detail?.languages_spoken}
            />
          </Section>

          {/* Past Experience */}

          <Section title="Past Experience">
            {user.professional_detail?.past_experiences?.map((exp, index) => (
              <div key={exp.id || index} className="border-b pb-2 mb-2">
                <div className="font-medium">{exp.role}</div>
                <div className="text-xs text-gray-500">{exp.organization}</div>
                <div className="text-xs">
                  {exp.start_year} - {exp.end_year || "Present"}
                </div>
              </div>
            ))}
          </Section>

          {/* Education */}

          <Section title="Education">
            {user.education.map((edu, index) => (
              <div key={edu.id || index} className="border-b pb-2 mb-2">
                <div className="font-medium">
                  {edu.degree || edu.course_name}
                </div>
                <div className="text-xs text-gray-500">
                  {edu.university || edu.institute}
                </div>
                <div className="text-xs">
                  {edu.start_year} - {edu.is_current ? "Present" : edu.end_year}
                </div>
              </div>
            ))}
          </Section>

          {/* Events */}

          {/* <Section title="Events">
            {user.registered_events?.map((event) => (
              <div key={event.event_id} className="border-b pb-2 mb-2">
                <div className="font-medium">{event.event_name}</div>
                <div className="text-xs text-gray-500">{event.category}</div>
                <div className="text-xs">
                  ₹{event.pricing} • {event.payment_status}
                </div>
              </div>
            ))}
          </Section> */}
        </div>
      </div>
    </div>
  );
};

export default PublicUserProfile;
