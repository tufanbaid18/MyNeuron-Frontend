import { Modal, Tabs, Button } from "antd";
import { HiPaperAirplane } from "react-icons/hi2";
import type { UploadFile } from "antd";
import type { UserProfile } from "../../../types/user/user.types";
import { PostTab } from "./PostTab";
import { ImageTab } from "./ImageTab";
import { VideoTab } from "./VideoTab";
import { ArticleTab } from "./ArticleTab";

interface CreatePostModalProps {
  open: boolean;
  activeTab: string;
  form: {
    title: string;
    content: string;
  };
  fileList: UploadFile[];
  ogPreview: string | null;
  isLoading: boolean;
  isEmpty: boolean;
  isEditMode: boolean;
  user: UserProfile;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  onTabChange: (tab: string) => void;
  onContentChange: (content: string) => void;
  onTitleChange: (title: string) => void;
  onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveFile: (uid: string) => void;
  onOgPaste: (text: string) => void;
  onVideoUrlChange: (url: string) => void;
  onSubmit: () => void;
  onClose: () => void;
}

export const CreatePostModal = ({
  open,
  activeTab,
  form,
  fileList,
  ogPreview,
  isLoading,
  isEmpty,
  isEditMode,
  user,
  fileInputRef,
  onTabChange,
  onContentChange,
  onTitleChange,
  onFileSelect,
  onRemoveFile,
  onOgPaste,
  onVideoUrlChange,
  onSubmit,
  onClose,
}: CreatePostModalProps) => {
  const userAvatar = user?.profile_image ? (
    <img src={user.profile_image} alt="" className="w-12 h-12 rounded-full" />
  ) : (
    <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center font-semibold">
      {user?.first_name?.[0]}
      {user?.last_name?.[0]}
    </div>
  );

  const handleClose = () => {
    onClose();
  };

  const tabItems = [
    {
      key: "post",
      label: "Post",
      children: (
        <PostTab
          content={form.content}
          onChange={onContentChange}
          onPaste={onOgPaste}
        />
      ),
    },
    {
      key: "image",
      label: "Image",
      children: (
        <ImageTab
          content={form.content}
          fileList={fileList}
          onContentChange={onContentChange}
          onPaste={onOgPaste}
          onFileSelect={onFileSelect}
          onRemoveFile={onRemoveFile}
          fileInputRef={fileInputRef}
        />
      ),
    },
    {
      key: "video",
      label: "Video",
      children: (
        <VideoTab
          content={form.content}
          fileList={fileList}
          onContentChange={onContentChange}
          onVideoUrlChange={onVideoUrlChange}
        />
      ),
    },
    {
      key: "article",
      label: "Article",
      children: (
        <ArticleTab
          title={form.title}
          content={form.content}
          onTitleChange={onTitleChange}
          onContentChange={onContentChange}
        />
      ),
    },
  ];

  return (
    <>
      <Modal
        open={open}
        onCancel={handleClose}
        footer={null}
        width={680}
        centered
        title={
          <span className="text-lg font-semibold">
            {isEditMode ? "Edit Post" : "Create Post"}
          </span>
        }
        destroyOnClose
      >
        <div className="flex items-center gap-3 mb-4">
          {userAvatar}
          <div>
            <p className="font-semibold">
              {user?.first_name} {user?.last_name}
            </p>
            <p className="text-sm text-gray-500">{user?.email}</p>
          </div>
        </div>

        <Tabs activeKey={activeTab} onChange={onTabChange} items={tabItems} />

        {/* OG Preview */}
        {ogPreview && (
          <div
            className="mt-3 og-preview"
            dangerouslySetInnerHTML={{ __html: ogPreview }}
          />
        )}

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept={
            activeTab === "video"
              ? "video/*"
              : activeTab === "image"
                ? "image/*"
                : "image/*,video/*"
          }
          multiple
          hidden
          onChange={onFileSelect}
        />

        {/* Footer */}
        <div className="flex justify-end mt-4 gap-2">
          <Button onClick={handleClose}>Cancel</Button>
          <Button
            type="primary"
            icon={<HiPaperAirplane className="w-4 h-4" />}
            loading={isLoading}
            disabled={isEmpty}
            onClick={onSubmit}
          >
            {isEditMode ? "Update" : "Post"}
          </Button>
        </div>
      </Modal>
    </>
  );
};
