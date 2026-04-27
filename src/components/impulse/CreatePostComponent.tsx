import { useCallback, useEffect, useRef, useState } from "react";
import type { UploadFile } from "antd";
import type { RcFile } from "antd/es/upload";
import { message } from "antd";
import {
  useCreatePost,
  useCreatePagePost,
} from "../../hooks/impulse/useCreatePost";
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
  const [videoLinkError, setVideoLinkError] = useState<string | null>(null);
  const [isValidatingLink, setIsValidatingLink] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const validationDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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
    setVideoLinkError(null);
    setIsValidatingLink(false);
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
    const combined = [...existing, ...validatedFiles].slice(
      0,
      IMPULSE_CONSTANTS.MAX_IMAGES,
    );

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

  // ─── Known video-platform patterns (accepted without a network check) ──────
  const KNOWN_VIDEO_PATTERNS = [
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)/i,
    /vimeo\.com\//i,
    /dailymotion\.com\//i,
    /dai\.ly\//i,
    /twitch\.tv\//i,
    /facebook\.com\/.*\/videos\//i,
    /instagram\.com\/(?:p|reel)\//i,
    /tiktok\.com\//i,
    /streamable\.com\//i,
    /rumble\.com\//i,
  ];

  const IMAGE_EXTENSIONS = /\.(png|jpg|jpeg|webp|gif|svg|bmp|ico)(\?.*)?$/i;
  const VIDEO_EXTENSIONS = /\.(mp4|webm|ogg|mov|avi|mkv|m4v|flv)(\?.*)?$/i;

  /**
   * Uses a hidden <img> element to test whether `url` is a loadable image.
   * Resolves true on load, false on error.
   */
  const testImageUrl = (url: string): Promise<boolean> =>
    new Promise((resolve) => {
      const img = new Image();
      const timer = setTimeout(() => {
        img.src = "";
        resolve(false);
      }, 8000);
      img.onload = () => { clearTimeout(timer); resolve(true); };
      img.onerror = () => { clearTimeout(timer); resolve(false); };
      img.src = url;
    });

  /**
   * Uses a hidden <video> element to test whether `url` is a loadable video.
   * Resolves true if the browser can start decoding, false otherwise.
   */
  const testVideoUrl = (url: string): Promise<boolean> =>
    new Promise((resolve) => {
      const video = document.createElement("video");
      video.muted = true;
      video.preload = "metadata";
      const timer = setTimeout(() => {
        video.src = "";
        resolve(false);
      }, 8000);
      video.oncanplay = () => { clearTimeout(timer); resolve(true); };
      video.onerror = () => { clearTimeout(timer); resolve(false); };
      video.src = url;
      video.load();
    });

  /**
   * Returns null if valid, or an error message string if not.
   * Uses browser-native element loading — no fetch/no-cors hacks.
   */
  const validateMediaLink = useCallback(async (url: string): Promise<string | null> => {
    if (!/^https?:\/\//i.test(url)) {
      return "Please enter a valid URL starting with http:// or https://";
    }

    // Known video platforms — trust them without a network round-trip
    if (KNOWN_VIDEO_PATTERNS.some((re) => re.test(url))) {
      return null;
    }

    // Route by file extension so we test the right element type
    if (IMAGE_EXTENSIONS.test(url)) {
      const ok = await testImageUrl(url);
      return ok ? null : "This URL does not point to a valid image. Please check the link.";
    }

    if (VIDEO_EXTENSIONS.test(url)) {
      const ok = await testVideoUrl(url);
      return ok ? null : "This URL does not point to a valid video. Please check the link.";
    }

    // Unknown extension — try image first, then video
    const isImage = await testImageUrl(url);
    if (isImage) return null;

    const isVideo = await testVideoUrl(url);
    if (isVideo) return null;

    return "This link does not appear to point to a valid image or video.";
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleVideoUrlChange = (url: string) => {
    // Always update the input immediately so it stays responsive
    if (!url) {
      setFileList([]);
      setOgPreview(null);
      setVideoLinkError(null);
      setIsValidatingLink(false);
      if (validationDebounceRef.current) clearTimeout(validationDebounceRef.current);
      return;
    }

    setFileList([{ uid: "-video-link", name: url, status: "done" as const, url }]);
    setIsValidatingLink(true);
    setVideoLinkError(null);

    // Debounce: wait 600ms after the user stops typing before validating
    if (validationDebounceRef.current) clearTimeout(validationDebounceRef.current);
    validationDebounceRef.current = setTimeout(async () => {
      const error = await validateMediaLink(url);
      setVideoLinkError(error);
      setIsValidatingLink(false);
      if (!error) {
        handleOgFromText(url);
      } else {
        setOgPreview(null);
      }
    }, 600);
  };

  const isLoading =
    createPost.isPending || createPagePost.isPending || updatePost.isPending;
  const isEmpty = !form.content?.trim() && fileList.length === 0 && !ogPreview;
  const isEditMode = !!editingPost;
  const hasLinkError =
    activeTab === "video" && (!!videoLinkError || isValidatingLink);

  const inferEditTab = (post: EditablePost): string => {
    const media = post.media || [];
    const hasVideoPreview =
      !!post.link_preview?.embed_url ||
      !!post.link_preview?.video_id ||
      (post.link_preview?.type || "").toLowerCase().includes("video") ||
      (post.link_preview?.watch_url || "").length > 0;
    if (media.some((m) => m.is_video)) return "video";
    if (hasVideoPreview) return "video";
    if (media.length > 0) return "image";
    if ((post.title || "").trim().length > 0) return "article";
    return "post";
  };

  const extractOgCardHtml = (content: string): string | null => {
    const match = content.match(
      /<div class="og-card"[\s\S]*?<\/div>\s*<\/div>/i,
    );
    return match ? match[0] : null;
  };

  const stripOgCardFromContent = (content: string): string => {
    return content
      .replace(/<div class="og-card"[\s\S]*?<\/div>\s*<\/div>/gi, "")
      .replace(/<p><\/p>/gi, "")
      .trim();
  };

  const extractReadMoreUrl = (content: string): string => {
    const hrefMatch = content.match(
      /<a[^>]*href="([^"]+)"[^>]*>\s*Read more\s*→?\s*<\/a>/i,
    );
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
      const resolvedVideoUrl =
        editingPost.link_preview?.watch_url || extractedReadMoreUrl;
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setForm({
        title: editingPost.title || "",
        content: inferredTab === "video" ? normalizedContent : rawContent,
      });
      setFileList(
        inferredTab === "video"
          ? resolvedVideoUrl
            ? [
                {
                  uid: `existing-video-link-${editingPost.id}`,
                  name: resolvedVideoUrl,
                  status: "done" as const,
                  url: resolvedVideoUrl,
                },
              ]
            : []
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

    if (activeTab === "video" && videoLinkError) {
      message.error(videoLinkError);
      return;
    }

    if (activeTab === "video" && isValidatingLink) {
      message.info("Please wait while the link is being validated");
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
        isEmpty={isEmpty || hasLinkError}
        isEditMode={isEditMode}
        user={user}
        fileInputRef={fileInputRef}
        onTabChange={(tab) => {
          setActiveTab(tab);
          // Clear link error when switching away from video tab
          if (tab !== "video") {
            setVideoLinkError(null);
            setIsValidatingLink(false);
          }
        }}
        onContentChange={(content) => setForm({ ...form, content })}
        onTitleChange={(title) => setForm({ ...form, title })}
        onFileSelect={handleFileSelect}
        onRemoveFile={removeImage}
        onOgPaste={handleOgFromText}
        onVideoUrlChange={handleVideoUrlChange}
        videoLinkError={videoLinkError}
        isValidatingLink={isValidatingLink}
        onSubmit={handleSubmit}
        onClose={handleClose}
      />
    </>
  );
};

export default CreatePostComponent;
