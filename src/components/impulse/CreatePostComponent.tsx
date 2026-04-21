import { useRef, useState } from "react";
import type { UploadFile } from "antd";
import type { RcFile } from "antd/es/upload";
import { message } from "antd";
import { useCreatePost, useCreatePagePost } from "../../hooks/impulse/useCreatePost";
import { useUpdatePost } from "../../hooks/impulse/useUpdatePost";
import { getOgiMeta } from "../../services/impulse/impulse.service";
import { buildOgHtml } from "../../utils/impulse.utils";
import { IMPULSE_CONSTANTS } from "../../constants/impulse.constants";
import type { UserProfile } from "../../types/user/user.types";
import { CreatePostTrigger, CreatePostModal } from "./create-post";

interface EditablePost {
  id: number;
  title?: string;
  content?: string;
  media?: { file_url: string; is_video: boolean }[];
}

interface CreatePostComponentProps {
  open: boolean;
  onOpen: () => void;
  onClose: () => void;
  onSuccess: () => void;
  editingPost?: EditablePost | null;
  user: UserProfile;
  pageId?: number;
}

const CreatePostComponent = ({
  open,
  onOpen,
  onClose,
  onSuccess,
  editingPost,
  user,
  pageId,
}: CreatePostComponentProps) => {
  const [activeTab, setActiveTab] = useState<string>("post");
  const [form, setForm] = useState({ title: "", content: "" });
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [ogPreview, setOgPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const createPost = useCreatePost({
    onSuccess: () => {
      message.success("Post created successfully");
      handleClose();
      onSuccess();
    },
    onError: () => {
      message.error("Failed to create post");
    },
  });

  const createPagePost = useCreatePagePost({
    onSuccess: () => {
      message.success("Page post created successfully");
      handleClose();
      onSuccess();
    },
    onError: () => {
      message.error("Failed to create page post");
    },
  });

  const updatePost = useUpdatePost({
    onSuccess: () => {
      message.success("Post updated successfully");
      handleClose();
      onSuccess();
    },
    onError: () => {
      message.error("Failed to update post");
    },
  });

  const handleClose = () => {
    setForm({ title: "", content: "" });
    setFileList([]);
    setOgPreview(null);
    setActiveTab("post");
    onClose();
  };

  const handleOgFromText = async (text: string) => {
    if (!/^https?:\/\//i.test(text)) return;
    try {
      const res = await getOgiMeta(text);
      setOgPreview(buildOgHtml(res));
    } catch {
      setOgPreview(null);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files ?? []);
    const allowedFiles = selected.filter(
      (file) =>
        file.type.startsWith("image/") || file.type.startsWith("video/"),
    );

    if (allowedFiles.length !== selected.length) {
      message.warning("Only images and videos are allowed");
    }

    const existing = fileList.map((f) => f.originFileObj as File);
    const combined = [...existing, ...allowedFiles].slice(0, IMPULSE_CONSTANTS.MAX_IMAGES);

    setFileList(
      combined.map((file, idx) => ({
        uid: `-${Date.now()}-${idx}`,
        name: file.name,
        status: "done" as const,
        originFileObj: file as RcFile,
        url: URL.createObjectURL(file),
      })),
    );
  };

  const removeImage = (uid: string) => {
    setFileList((prev) => prev.filter((f) => f.uid !== uid));
  };

  const handleVideoUrlChange = (url: string) => {
    if (url) {
      setFileList([{
        uid: "-video-link",
        name: url,
        status: "done" as const,
        url,
      }]);
      handleOgFromText(url);
    } else {
      setFileList([]);
      setOgPreview(null);
    }
  };

  const isLoading = createPost.isPending || createPagePost.isPending || updatePost.isPending;
  const isEmpty = !form.content?.trim() && fileList.length === 0 && !ogPreview;
  const isEditMode = !!editingPost;

  const handleSubmit = () => {
    if (isEmpty) {
      message.warning("Post cannot be empty");
      return;
    }

    let finalContent = form.content?.trim() || "";
    if (ogPreview && !finalContent.includes("og-card")) {
      finalContent += ogPreview;
    }

    const files = fileList.map((f) => f.originFileObj as File);

    if (isEditMode && editingPost) {
      updatePost.mutate({
        postId: editingPost.id,
        title: form.title?.trim() || "",
        content: finalContent,
        files,
      });
    } else if (pageId) {
      createPagePost.mutate({
        pageId,
        title: form.title?.trim() || "",
        content: finalContent,
        files,
      });
    } else {
      createPost.mutate({
        title: form.title?.trim() || "",
        content: finalContent,
        files,
      });
    }
  };

  return (
    <>
      <CreatePostTrigger
        user={user}
        onOpen={onOpen}
        onTabChange={setActiveTab}
      />

      <CreatePostModal
        open={open}
        activeTab={activeTab}
        form={form}
        fileList={fileList}
        ogPreview={ogPreview}
        isLoading={isLoading}
        isEmpty={isEmpty}
        isEditMode={isEditMode}
        user={user}
        fileInputRef={fileInputRef}
        onTabChange={setActiveTab}
        onContentChange={(content) => setForm({ ...form, content })}
        onTitleChange={(title) => setForm({ ...form, title })}
        onFileSelect={handleFileSelect}
        onRemoveFile={removeImage}
        onOgPaste={handleOgFromText}
        onVideoUrlChange={handleVideoUrlChange}
        onSubmit={handleSubmit}
        onClose={handleClose}
      />
    </>
  );
};

export default CreatePostComponent;
