import { Clock3, UserCheck, UserPlus, Users } from "lucide-react";
import { RiUserFollowLine } from "react-icons/ri";
import Loading from "../components/ui/Loading";
import {
  MyActivityTypes,
  type MyActivityOverview,
} from "../types/impulse/feed.types";

export const getMyActivityOverviewItems = ({
  error,
  isLoading,
  isFetching,
  data,
}: {
  error: Error | null;
  isLoading: boolean;
  isFetching: boolean;
  data: MyActivityOverview | undefined;
}) => {
  return error
    ? [
        {
          icon: <RiUserFollowLine />,
          heading: "Activity",
          data: 0,
          type: MyActivityTypes.FOLLOW_REQUESTS,
        },
      ]
    : [
        {
          icon: <UserPlus className="w-5 h-5" />,
          heading: "Follow Requests",
          data: (
            <div className="flex justify-center items-center rounded-full w-8 h-8 bg-primary text-white">
              {isLoading || isFetching ? (
                <Loading className="w-2 h-2" />
              ) : (
                data?.follow_requests
              )}
            </div>
          ),
          type: MyActivityTypes.FOLLOW_REQUESTS,
        },
        {
          icon: <Clock3 className="w-5 h-5" />,
          heading: "Pending Requests",
          data: (
            <div className="flex justify-center items-center rounded-full w-8 h-8 bg-primary text-white">
              {isLoading || isFetching ? (
                <Loading className="w-2 h-2" />
              ) : (
                data?.pending_requests
              )}
            </div>
          ),
          type: MyActivityTypes.PENDING_REQUESTS,
        },
        {
          icon: <UserCheck className="w-5 h-5" />,
          heading: "Following",
          data: (
            <div className="flex justify-center items-center rounded-full w-8 h-8 bg-primary text-white">
              {isLoading || isFetching ? (
                <Loading className="w-2 h-2" />
              ) : (
                data?.following
              )}
            </div>
          ),
          type: MyActivityTypes.FOLLOWING,
        },
        {
          icon: <Users className="w-5 h-5" />,
          heading: "Followers",
          data: (
            <div className="flex justify-center items-center rounded-full w-8 h-8 bg-primary text-white">
              {isLoading || isFetching ? (
                <Loading className="w-2 h-2" />
              ) : (
                data?.followers
              )}
            </div>
          ),
          type: MyActivityTypes.FOLLOWERS,
        },
      ];
};
