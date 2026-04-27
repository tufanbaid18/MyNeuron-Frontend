import { useEffect, useRef, useState } from "react";
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
  link_preview?: {
    type?: string;
    embed_url?: string;
    video_id?: string;
    watch_url?: string;
  } | null;
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

  const MAX_FILE_SIZE_MB = 5;
  const MAX_FILENAME_LENGTH = 90;

  const truncateFilename = (name: string): string => {
    if (name.length <= MAX_FILENAME_LENGTH) return name;
    const ext = name.split(".").pop() ?? "";
    const baseName = name.slice(0, name.length - ext.length - 1);
    const availableLength = MAX_FILENAME_LENGTH - ext.length - 1;
    return `${baseName.slice(0, Math.max(availableLength, 1))}.${ext}`;
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

    const validatedFiles = allowedFiles.filter((file) => {
      const sizeMB = file.size / 1024 / 1024;
      if (sizeMB > MAX_FILE_SIZE_MB) {
        message.warning(`"${truncateFilename(file.name)}" exceeds 5MB limit`);
        return false;
      }
      return true;
    });

    const existing = fileList.map((f) => f.originFileObj as File);
    const combined = [...existing, ...validatedFiles].slice(0, IMPULSE_CONSTANTS.MAX_IMAGES);

    setFileList(
      combined.map((file, idx) => ({
        uid: `-${Date.now()}-${idx}`,
        name: truncateFilename(file.name),
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

  const inferEditTab = (post: EditablePost): string => {
    const media = post.media || [];
    const hasVideoPreview = !!post.link_preview?.embed_url
      || !!post.link_preview?.video_id
      || (post.link_preview?.type || "").toLowerCase().includes("video")
      || (post.link_preview?.watch_url || "").length > 0;
    if (media.some((m) => m.is_video)) return "video";
    if (hasVideoPreview) return "video";
    if (media.length > 0) return "image";
    if ((post.title || "").trim().length > 0) return "article";
    return "post";
  };

  const extractOgCardHtml = (content: string): string | null => {
    const match = content.match(/<div class="og-card"[\s\S]*?<\/div>\s*<\/div>/i);
    return match ? match[0] : null;
  };

  const stripOgCardFromContent = (content: string): string => {
    return content
      .replace(/<div class="og-card"[\s\S]*?<\/div>\s*<\/div>/gi, "")
      .replace(/<p><\/p>/gi, "")
      .trim();
  };

  const extractReadMoreUrl = (content: string): string => {
    const hrefMatch = content.match(/<a[^>]*href="([^"]+)"[^>]*>\s*Read more\s*→?\s*<\/a>/i);
    return hrefMatch?.[1] || "";
  };

  useEffect(() => {
    if (!open) return;

    if (editingPost) {
      const inferredTab = inferEditTab(editingPost);
      const rawContent = editingPost.content || "";
      const ogCardHtml = extractOgCardHtml(rawContent);
      const normalizedContent = stripOgCardFromContent(rawContent);
      const extractedReadMoreUrl = extractReadMoreUrl(rawContent);
      const resolvedVideoUrl = editingPost.link_preview?.watch_url || extractedReadMoreUrl;
      setForm({
        title: editingPost.title || "",
        content: inferredTab === "video" ? normalizedContent : rawContent,
      });
      setFileList(
        inferredTab === "video"
          ? (resolvedVideoUrl
            ? [{
                uid: `existing-video-link-${editingPost.id}`,
                name: resolvedVideoUrl,
                status: "done" as const,
                url: resolvedVideoUrl,
              }]
            : [])
          : (editingPost.media || []).map((media, idx) => ({
              uid: `existing-${editingPost.id}-${idx}`,
              name: media.file_url.split("/").pop() || `media-${idx + 1}`,
              status: "done" as const,
              url: media.file_url,
            })),
      );
      setOgPreview(inferredTab === "video" ? ogCardHtml : null);
      setActiveTab(inferredTab);
      return;
    }

    setForm({ title: "", content: "" });
    setFileList([]);
  }, [open, editingPost]);

  const handleSubmit = () => {
    if (isEmpty) {
      message.warning("Post cannot be empty");
      return;
    }

    let finalContent = form.content?.trim() || "";
    if (ogPreview && !finalContent.includes("og-card")) {
      finalContent += ogPreview;
    }

    const files = fileList
      .map((f) => f.originFileObj as File | undefined)
      .filter((f): f is File => !!f);

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
