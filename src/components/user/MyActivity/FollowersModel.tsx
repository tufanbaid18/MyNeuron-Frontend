import { Modal } from "antd";
import { useAtomValue } from "jotai";
import React from "react";
import { useGetMyFollowers } from "../../../hooks/impulse/useMyActivity";
import { userProfileAtom } from "../../../store/auth.store";
import { MyActivityTypes } from "../../../types/impulse/feed.types";
import type { UserMiniProfile } from "../../../types/impulse/myactivity.types";
import ErrorComponent from "../../ui/ErrorComponent";
import Loading from "../../ui/Loading";
import ModelHeader from "../../ui/ModelHeader";
import Followers from "./Followers";

type FollowersModelProps = {
  open: boolean;
  onCancel: () => void;
};
const FollowersModel: React.FC<FollowersModelProps> = ({ open, onCancel }) => {
  const user = useAtomValue(userProfileAtom);

  const { data, isLoading, error } = useGetMyFollowers(user?.id ?? 0);

  return (
    <>
      <Modal
        title={<ModelHeader title="Followers"/>}
        footer={null}
        loading={isLoading}
        open={open}
        onCancel={onCancel}
        centered
      >
        {isLoading ? (
          <Loading />
        ) : error ? (
          <ErrorComponent />
        ) : data?.length === 0 ? (
          <p className="text-center">No followers found</p>
        ) : (
          <div className="flex flex-col gap-4">
            {data?.map((user: UserMiniProfile) => (
              <Followers
                type={MyActivityTypes.FOLLOWERS}
                key={user.id}
                user={user}
                requestId={0}
              />
            ))}
          </div>
        )}
      </Modal>
    </>
  );
};

export default FollowersModel;
