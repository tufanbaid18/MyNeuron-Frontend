import { Card, Tooltip, Typography } from "antd";
import React, { useMemo } from "react";
import { getMyActivityOverviewItems } from "../../constants/myActivity.constants";
import { useMyActivityOverview } from "../../hooks/impulse/useMyActivity";
import {
  MyActivityTypes,
  type MyActivityOverviewItem,
} from "../../types/impulse/feed.types";
import ErrorComponent from "../ui/ErrorComponent";
import FollowersModel from "../user/MyActivity/FollowersModel";
import FollowingModel from "../user/MyActivity/FollowingModel";
import FollowRequestsModel from "../user/MyActivity/FollowRequestsModel";
import PendingRequestsModel from "../user/MyActivity/PendingRequestsModel";

const { Text } = Typography;

const MyActivityOverview = () => {
  const { data, isLoading, isFetching, error } = useMyActivityOverview();
  const [openModel, setOpenModel] = React.useState<boolean>(false);
  const [modelType, setModelType] = React.useState<MyActivityTypes | null>(
    null,
  );

  const handleCloseModel = () => {
    setOpenModel(false);
  };

  const handleOnClickViewAll = ({ type }: { type: MyActivityTypes }) => {
    setModelType(type);
    setOpenModel(true);
  };

  const activity: MyActivityOverviewItem[] = useMemo(() => {
    return getMyActivityOverviewItems({ error, isLoading, isFetching, data });
  }, [data, isLoading, isFetching, error]);

  return (
    <Card>
      <div
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Text strong>My Activity</Text>
        {/* <Button
          type="text"
          size="small"
          title="View all activity"
          icon={<ChevronRight style={{ width: 18, height: 18 }} />}
          onClick={() =>
            handleOnClickViewAll({ type: MyActivityTypes.FOLLOW_REQUESTS })
          }
          style={{ padding: 0 }}
        /> */}
      </div>
      <div>
        {error ? (
          <ErrorComponent />
        ) : (
          <div style={{ display: "flex", flexDirection: "column" }}>
            {activity.map((item: MyActivityOverviewItem, index: number) => (
              <div
                key={index}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "10px 12px",
                  borderRadius: 8,
                  cursor: "pointer",
                  gap: 8,
                  minWidth: 0,
                }}
                className={`hover:bg-gray-100 dark:hover:bg-gray-800 transition-all`}
                onClick={() => handleOnClickViewAll({ type: item.type })}
              >
                <div
                  style={{
                    display: "flex",
                    gap: 8,
                    alignItems: "center",
                    minWidth: 0,
                    flex: 1,
                    overflow: "hidden",
                  }}
                >
                  <span
                    style={{
                      flexShrink: 0,
                      color: "var(--primary)",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    {item.icon}
                  </span>
                  <Tooltip title={item.heading}>
                    <Text
                      ellipsis
                      style={{
                        display: "block",
                        minWidth: 0,
                        flex: 1,
                        fontSize: 14,
                      }}
                    >
                      {item.heading}
                    </Text>
                  </Tooltip>
                </div>
                <Text style={{ flexShrink: 0, fontWeight: 500, fontSize: 14 }}>
                  {item.data}
                </Text>
              </div>
            ))}
          </div>
        )}
      </div>
      {modelType === MyActivityTypes.FOLLOWERS && (
        <FollowersModel open={openModel} onCancel={handleCloseModel} />
      )}
      {modelType === MyActivityTypes.FOLLOWING && (
        <FollowingModel open={openModel} onCancel={handleCloseModel} />
      )}
      {modelType === MyActivityTypes.FOLLOW_REQUESTS && (
        <FollowRequestsModel open={openModel} onCancel={handleCloseModel} />
      )}
      {modelType === MyActivityTypes.PENDING_REQUESTS && (
        <PendingRequestsModel open={openModel} onCancel={handleCloseModel} />
      )}
    </Card>
  );
};

export default MyActivityOverview;
