import { Button, Card, Divider, Typography } from "antd";
import Avatar from "antd/es/avatar/Avatar";
import type { UserProfile } from "../../types/user/user.types";
import { getAvatarByName } from "../../utils/avatar.utils";
import { useNavigate } from "@tanstack/react-router";
import { APP_ROUTES } from "../../constants/app.routes";

const FeedProfile = ({ user }: { user: UserProfile }) => {
  const navigate = useNavigate();
  return (
    <Card variant="borderless" className="col-span-3 h-max">
      <div className="flex flex-col items-center justify-center gap-2">
        <Avatar
          src={
            user.profile_image ||
            getAvatarByName({
              firstName: user.first_name,
              lastName: user.last_name,
            })
          }
          size={80}
        />
        <div className="flex flex-col items-center justify-center">
          <span className="font-semibold">
            {user?.first_name + " " + user?.last_name}
          </span>
          <span className="text-sm text-gray-500">
            {user?.professional_detail?.current_role}
          </span>
        </div>
        <Divider className="p-0! m-0!" />
        {user?.professional_detail && (
          <>
            <div className="flex flex-col items-center justify-center bg-gray-100 w-full rounded-lg p-2">
              <Typography className="font-semibold!">
                {user?.professional_detail?.current_organization &&
                user?.professional_detail?.current_organization?.length > 20
                  ? user?.professional_detail?.current_organization?.slice(
                      0,
                      20,
                    ) + "..."
                  : user?.professional_detail?.current_organization}
              </Typography>
              <Typography className="text-xs! text-gray-500!">
                {user?.professional_detail?.current_role &&
                user?.professional_detail?.current_role?.length > 20
                  ? user?.professional_detail?.current_role?.slice(0, 20) +
                    "..."
                  : user?.professional_detail?.current_role}
              </Typography>
            </div>
            <Divider className="p-0! m-0!" />
          </>
        )}
        <Button
          variant="outlined"
          className="w-full border border-primary! text-primary! rounded-full! hover:bg-primary! hover:text-white!"
          onClick={() =>
            navigate({
              to: APP_ROUTES.PROFILE,
              search: { userId: user.id.toString() },
            })
          }
        >
          View Profile
        </Button>
      </div>
    </Card>
  );
};

export default FeedProfile;
