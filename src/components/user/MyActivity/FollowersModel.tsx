import { Button, Modal } from "antd";
import React, { useMemo } from "react";
import { MyActivityTypes } from "../../../types/impulse/feed.types";

type FollowersModelProps = {
  open: boolean;
  onCancel: () => void;
  type: MyActivityTypes | null;
};
const FollowersModel: React.FC<FollowersModelProps> = ({
  open,
  onCancel,
  type,
}) => {
  //   const [loading, setLoading] = React.useState<boolean>(true);

  //   const showLoading = () => {
  //     setLoading(true);

  //     // Simple loading mock. You should add cleanup logic in real world.
  //     setTimeout(() => {
  //       setLoading(false);
  //     }, 2000);
  //   };

  const title = useMemo(() => {
    switch (type) {
      case MyActivityTypes.FOLLOW_REQUESTS:
        return "Follow Requests";
      case MyActivityTypes.PENDING_REQUESTS:
        return "Pending Requests";
      case MyActivityTypes.FOLLOWERS:
        return "Followers";
      case MyActivityTypes.FOLLOWING:
        return "Following";
      default:
        return "";
    }
  }, [type]);

  return (
    <>
      {/* <Button type="primary" onClick={showLoading}>
        Open Modal
      </Button> */}
      <Modal
        title={<p>{title}</p>}
        footer={
          <Button type="primary" onClick={onCancel}>
            Close
          </Button>
        }
        // loading={loading}
        open={open}
        onCancel={onCancel}
      >
        <p>Modal Content</p>
      </Modal>
    </>
  );
};

export default FollowersModel;
