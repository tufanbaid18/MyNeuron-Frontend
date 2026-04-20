import { Button, Modal } from "antd";
import React from "react";
import { useGetMyFollowing } from "../../../hooks/impulse/useMyActivity";
import { MyActivityTypes } from "../../../types/impulse/feed.types";
import type { MyActivityUserResponse } from "../../../types/impulse/myactivity.types";
import ErrorComponent from "../../ui/ErrorComponent";
import Loading from "../../ui/Loading";
import Followers from "./Followers";
;

type FollowingModelProps = {
  open: boolean;
  onCancel: () => void;
};

const FollowingModel: React.FC<FollowingModelProps> = ({ open, onCancel }) => {
  const { data, isLoading, error } = useGetMyFollowing();

  return (
    <>
      <Modal
        title={<p>Following</p>}
        footer={
          <Button type="primary" onClick={onCancel}>
            Close
          </Button>
        }
        open={open}
        onCancel={onCancel}
        loading={isLoading}
      >
        {isLoading ? (
          <Loading />
        ) : error ? (
          <ErrorComponent />
        ) : data?.length === 0 ? (
          <p className="text-center">Not following anyone yet</p>
        ) : (
          <div className="flex flex-col gap-4">
            {data?.map((user: MyActivityUserResponse) => (
              <Followers
                type={MyActivityTypes.FOLLOWING}
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

export default FollowingModel;
