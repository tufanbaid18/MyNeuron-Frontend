import { Link } from "@tanstack/react-router";
import { Empty, Spin } from "antd";
import { APP_ROUTES } from "../../constants/app.routes";
import { env } from "../../constants/env";
import { useGatcMembers } from "../../hooks/gatc/useGatc";
import { getAvatarByName } from "../../utils/avatar.utils";

const GatcParticipants = () => {
  const {
    data: members,
    isLoading,
    error,
  } = useGatcMembers({
    role: "participant",
    event: Number(env.VITE_DEFAULT_GATC_EVENT_ID),
  });

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return <div className="p-8 text-red-500">Failed to load participants.</div>;
  }

  if (!members || members.length === 0) {
    return (
      <div className="p-8">
        <h1 className="mb-10 text-2xl font-bold text-gray-400">Participants</h1>
        <Empty description="No participants found." />
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="mb-10 text-2xl font-bold text-gray-400">Participants</h1>

      <div className="grid grid-cols-2 gap-10 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {members.map((member) => (
          <Link
            key={member.id}
            to={APP_ROUTES.GATC_MEMBER(member.id)}
            className="group flex flex-col items-center text-center transition-transform hover:-translate-y-1"
          >
            <div className="mb-4 h-32 w-32 overflow-hidden rounded-full bg-slate-100 shadow-sm transition-shadow group-hover:shadow-md">
              <img
                src={
                  member.user.profile_image ||
                  getAvatarByName({
                    firstName: member.user.first_name,
                    lastName: member.user.last_name,
                  })
                }
                alt={member.user.first_name}
                className="h-full w-full object-cover"
              />
            </div>

            <h3 className="text-lg font-medium text-slate-800 transition-colors group-hover:text-emerald-600">
              {member.user.first_name}{" "}
              {member.user.middle_name ? `${member.user.middle_name} ` : ""}
              {member.user.last_name}
            </h3>

            <p className="text-sm font-medium text-slate-400">Participant</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default GatcParticipants;
