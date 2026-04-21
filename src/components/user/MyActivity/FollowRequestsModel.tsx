import { Modal } from "antd";
import React from "react";
import { useIncomingFollowRequests } from "../../../hooks/impulse/useMyActivity";
import { MyActivityTypes } from "../../../types/impulse/feed.types";
import type { MyActivityUserResponse } from "../../../types/impulse/myactivity.types";
import ErrorComponent from "../../ui/ErrorComponent";
import ModelHeader from "../../ui/ModelHeader";
import Followers from "./Followers";

type FollowRequestsModelProps = {
  open: boolean;
  onCancel: () => void;
};

const FollowRequestsModel: React.FC<FollowRequestsModelProps> = ({
  open,
  onCancel,
}) => {
  const { data, isLoading, error } = useIncomingFollowRequests();

  return (
    <>
      <Modal
        title={<ModelHeader title="Follow Requests" />}
        footer={null}
        loading={isLoading}
        open={open}
        onCancel={onCancel}
        centered
      >
        {error ? (
          <ErrorComponent />
        ) : data?.length === 0 ? (
          <p className="text-center">No follow requests found</p>
        ) : (
          <div className="flex flex-col gap-4">
            {data?.map((request: MyActivityUserResponse) => (
              <Followers
                type={MyActivityTypes.FOLLOW_REQUESTS}
                key={request.id}
                user={request.follower}
                requestId={request.id}
              />
            ))}
          </div>
        )}
      </Modal>
    </>
  );
};

export default FollowRequestsModel;
