import { Modal } from "antd";
import React from "react";

import { useOutgoingFollowRequests } from "../../../hooks/impulse/useMyActivity";
import { MyActivityTypes } from "../../../types/impulse/feed.types";
import type { MyActivityUserResponse } from "../../../types/impulse/myactivity.types";
import ErrorComponent from "../../ui/ErrorComponent";
import ModelHeader from "../../ui/ModelHeader";
import Followers from "./Followers";

type PendingRequestsModelProps = {
  open: boolean;
  onCancel: () => void;
};

const PendingRequestsModel: React.FC<PendingRequestsModelProps> = ({
  open,
  onCancel,
}) => {
  const { data, isLoading, error } = useOutgoingFollowRequests();


  return (
    <>
      <Modal
        title={<ModelHeader title="Pending Requests" />}
        footer={null}
        open={open}
        onCancel={onCancel}
        loading={isLoading}
        centered
      >
        {error ? (
          <ErrorComponent />
        ) : data?.length === 0 ? (
          <p className="text-center">No pending requests found</p>
        ) : (
          <div className="flex flex-col gap-4">
            {data?.map((user: MyActivityUserResponse) => (
              <Followers
                type={MyActivityTypes.PENDING_REQUESTS}
                key={user.id}
                user={user.following}
                requestId={user.id}
              />
            ))}
          </div>
        )}
      </Modal>
    </>
  );
};

export default PendingRequestsModel;
