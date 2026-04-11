import { useState } from "react";
import { useUserProfile } from "../../hooks/auth/useUserProfile";
import CreatePostComponent from "./CreatePostComponent";

const CreatePost = () => {
  const [open, setOpen] = useState(false);
  const { data: user } = useUserProfile();

  return (
    <CreatePostComponent
      open={open}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      onSuccess={() => setOpen(false)}
      user={user!}
    />
  );
};

export default CreatePost;
