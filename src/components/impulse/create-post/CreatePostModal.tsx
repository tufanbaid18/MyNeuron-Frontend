import { Avatar, Modal, Tabs, Button, Typography, Tooltip } from "antd";
import { HiPaperAirplane } from "react-icons/hi2";
import type { UploadFile } from "antd";
import type { UserProfile } from "../../../types/user/user.types";
import { PostTab } from "./PostTab";
import { ImageTab } from "./ImageTab";
import { VideoTab } from "./VideoTab";
import { ArticleTab } from "./ArticleTab";

const { Text } = Typography;

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
  const fullName = `${user?.first_name ?? ""} ${user?.last_name ?? ""}`.trim();

  const userAvatar = user?.profile_image ? (
    <Avatar
      src={user.profile_image}
      size={44}
      style={{ flexShrink: 0, aspectRatio: "1 / 1" }}
    />
  ) : (
    <Avatar
      size={44}
      className="bg-primary"
      style={{
        flexShrink: 0,
        aspectRatio: "1 / 1",
        color: "#fff",
        fontWeight: 600,
      }}
    >
      {user?.first_name?.[0]}
      {user?.last_name?.[0]}
    </Avatar>
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
        width="90vw"
        style={{ maxWidth: 680 }}
        centered
        title={
          <Text strong style={{ fontSize: 17 }}>
            {isEditMode ? "Edit Post" : "Create Post"}
          </Text>
        }
        destroyOnHidden
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            marginBottom: 16,
          }}
        >
          {userAvatar}
          <div style={{ minWidth: 0, flex: 1, overflow: "hidden" }}>
            <Tooltip title={fullName}>
              <Text
                strong
                ellipsis
                style={{ display: "block", maxWidth: "100%" }}
              >
                {fullName}
              </Text>
            </Tooltip>
            <Tooltip title={user?.email}>
              <Text
                type="secondary"
                ellipsis
                style={{ display: "block", maxWidth: "100%", fontSize: 13 }}
              >
                {user?.email}
              </Text>
            </Tooltip>
          </div>
        </div>

        <Tabs activeKey={activeTab} onChange={onTabChange} items={tabItems} />

        {/* OG Preview */}
        {ogPreview && (
          <div
            style={{ marginTop: 12 }}
            className="og-preview"
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
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginTop: 16,
            gap: 8,
            flexWrap: "wrap",
          }}
        >
          <Button onClick={handleClose}>Cancel</Button>
          <Button
            type="primary"
            icon={<HiPaperAirplane style={{ width: 16, height: 16 }} />}
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
