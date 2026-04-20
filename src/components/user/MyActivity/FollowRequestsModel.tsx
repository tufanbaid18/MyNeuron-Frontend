import { Button, Modal } from "antd";
import React from "react";
import { useIncomingFollowRequests } from "../../../hooks/impulse/useMyActivity";
import { MyActivityTypes } from "../../../types/impulse/feed.types";
import type { MyActivityUserResponse } from "../../../types/user/user.types";
import ErrorComponent from "../../ui/ErrorComponent";
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
  console.log("incoming follow request data=========> ", data);

  return (
    <>
      <Modal
        title={<p>Follow Requests</p>}
        footer={
          <Button type="primary" onClick={onCancel}>
            Close
          </Button>
        }
        loading={isLoading}
        open={open}
        onCancel={onCancel}
      >
        {error ? (
          <ErrorComponent />
        ) : data?.length === 0 ? (
          <p className="text-center">No follow requests found</p>
        ) : (
          <div className="flex flex-col gap-4">
            {data?.map((user: MyActivityUserResponse) => (
              <Followers
                type={MyActivityTypes.FOLLOW_REQUESTS}
                key={user.id}
                user={user.following}
              />
            ))}
          </div>
        )}
      </Modal>
    </>
  );
};

export default FollowRequestsModel;
