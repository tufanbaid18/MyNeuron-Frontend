import { useNavigate } from "@tanstack/react-router";
import { Button, Card, Typography } from "antd";
import { ChevronRight } from "lucide-react";
import { useMemo } from "react";
import { APP_ROUTES } from "../../constants/app.routes";
import { getMyActivityOverviewItems } from "../../constants/myActivity.constants";
import { useMyActivityOverview } from "../../hooks/impulse/useMyActivity";
import {
  MyActivityTypes,
  type MyActivityOverviewItem,
} from "../../types/impulse/feed.types";
import ErrorComponent from "../ui/ErrorComponent";

const MyActivityOverview = () => {
  const { data, isLoading, isFetching, error } = useMyActivityOverview();
  const navigate = useNavigate();

  const handleOnClickViewAll = ({ type }: { type?: MyActivityTypes }) => {
    if (!type) {
      type = MyActivityTypes.FOLLOW_REQUESTS;
    }
    navigate({
      to: APP_ROUTES.MY_ACTIVITY,
      search: { filter: type },
    });
  };

  const activity: MyActivityOverviewItem[] = useMemo(() => {
    return getMyActivityOverviewItems({ error, isLoading, isFetching, data });
  }, [data, isLoading, isFetching, error]);

  return (
    <Card>
      <div className="w-full flex justify-between items-center ">
        <Typography className="font-semibold">My Activity</Typography>
        <Button
          className="border-none!  p-0! m-0!"
          title="View all activity"
          onClick={() =>
            handleOnClickViewAll({ type: MyActivityTypes.FOLLOW_REQUESTS })
          }
        >
          <ChevronRight />
        </Button>
      </div>
      <div>
        {error ? (
          <ErrorComponent />
        ) : (
          <div className="flex flex-col items-stretch">
            {activity.map((item: MyActivityOverviewItem, index: number) => (
              <div
                key={index}
                className="flex justify-between rounded-lg items-center p-3 cursor-pointer hover:bg-gray-100"
                onClick={() => handleOnClickViewAll({ type: item.type })}
              >
                <div className="flex gap-2 justify-center items-center">
                  <Typography className="text-primary!">{item.icon}</Typography>
                  <Typography>{item.heading}</Typography>
                </div>
                <Typography>{item.data}</Typography>
              </div>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
};

export default MyActivityOverview;
