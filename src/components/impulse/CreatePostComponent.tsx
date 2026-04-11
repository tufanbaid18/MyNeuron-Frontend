import { useRef, useState } from "react";

import { Editor } from "@tinymce/tinymce-react";
import DOMPurify from "dompurify";
import {
  HiPhoto,
  HiDocumentText,
  HiPaperAirplane,
} from "react-icons/hi2";
import {
  Avatar,
  Button,
  Card,
  Input,
  Modal,
  Tabs,
  message,
} from "antd";
import type { UploadFile } from "antd";
import type { RcFile } from "antd/es/upload";
import { useCreatePost } from "../../hooks/impulse/useCreatePost";
import { useUpdatePost } from "../../hooks/impulse/useUpdatePost";
import { getOgiMeta } from "../../services/impulse/impulse.service";
import type { PostData } from "../../types/impulse/post.types";
import type { UserProfile } from "../../types/user/user.types";

const MAX_IMAGES = 6;

interface CreatePostComponentProps {
  open: boolean;
  onOpen: () => void;
  onClose: () => void;
  onSuccess: () => void;
  editingPost?: PostData | null;
  user: UserProfile;
}

const buildOgHtml = (res: { url: string; og: Record<string, string | undefined> }) => {
  const og = res.og;
  return `
    <div class="og-card" contenteditable="false"
         style="border:1px solid #e5e7eb;border-radius:8px;overflow:hidden;margin:12px 0;font-family:Arial,sans-serif;">
      ${
        og["og:image"]
          ? `<img src="${og["og:image"]}" alt="${og["og:title"]}" style="width:100%;max-height:300px;object-fit:cover;" />`
          : ""
      }
      <div style="padding:12px;">
        <div style="font-size:12px;color:#6b7280;margin-bottom:4px;">${og["og:site_name"] || ""}</div>
        <div style="font-size:16px;font-weight:600;margin-bottom:6px;">${og["og:title"]}</div>
        <div style="font-size:14px;color:#374151;">${og["og:description"] || ""}</div>
        <a href="${res.url}" target="_blank" style="display:inline-block;margin-top:8px;font-size:13px;color:#2563eb;">Read more →</a>
      </div>
    </div><p></p>
  `;
};

const CreatePostComponent = ({
  open,
  onOpen,
  onClose,
  onSuccess,
  editingPost,
  user,
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
    const imageFiles = selected.filter((file) => file.type.startsWith("image/"));

    if (imageFiles.length !== selected.length) {
      message.warning("Only images are allowed");
    }

    const existing = fileList.map((f) => f.originFileObj as File);
    const combined = [...existing, ...imageFiles].slice(0, MAX_IMAGES);

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

  const handlePaste = async (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    const text = e.clipboardData.getData("text/plain");
    handleOgFromText(text);
  };

  const isLoading = createPost.isPending || updatePost.isPending;
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
    } else {
      createPost.mutate({
        title: form.title?.trim() || "",
        content: finalContent,
        files,
      });
    }
  };

  const removeImage = (uid: string) => {
    setFileList((prev) => prev.filter((f) => f.uid !== uid));
  };

  const userAvatar = user?.profile_image ? (
    <Avatar src={user.profile_image} size={48} />
  ) : (
    <Avatar size={48} className="bg-primary text-white font-semibold">
      {user?.first_name?.[0]}
      {user?.last_name?.[0]}
    </Avatar>
  );

  return (
    <>
      {/* Trigger Area */}
      <Card
        className="mb-3 cursor-pointer hover:border-primary transition-colors"
        onClick={() => !isEditMode && onOpen()}
      >
        <div className="flex items-center gap-3">
          {userAvatar}
          <Input
            readOnly
            placeholder="Start a post"
            className="rounded-full cursor-pointer"
            onClick={() => !isEditMode && onOpen()}
          />
        </div>
        <div className="flex justify-around mt-3 px-2">
          <Button
            type="text"
            icon={<HiPhoto className="w-5 h-5 text-blue-500" />}
            onClick={() => {
              setActiveTab("image");
              if (!isEditMode) onOpen();
            }}
          >
            Media
          </Button>
          <Button
            type="text"
            icon={<HiDocumentText className="w-5 h-5 text-orange-500" />}
            onClick={() => {
              setActiveTab("article");
              if (!isEditMode) onOpen();
            }}
          >
            Article
          </Button>
        </div>
      </Card>

      {/* Modal */}
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
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={[
            {
              key: "post",
              label: "Post",
              children: (
                <div className="flex flex-col gap-3">
                  <Input.TextArea
                    rows={4}
                    placeholder="What do you want to talk about?"
                    value={form.content}
                    onChange={(e) =>
                      setForm({ ...form, content: e.target.value })
                    }
                    onPaste={handlePaste}
                    className="resize-none"
                  />
                </div>
              ),
            },
            {
              key: "image",
              label: "Image",
              children: (
                <div className="flex flex-col gap-3">
                  <Input.TextArea
                    rows={3}
                    placeholder="What do you want to talk about?"
                    value={form.content}
                    onChange={(e) =>
                      setForm({ ...form, content: e.target.value })
                    }
                    onPaste={handlePaste}
                    className="resize-none"
                  />
                  <div className="flex gap-2 flex-wrap">
                    {fileList.map((file) => (
                      <div key={file.uid} className="relative w-20 h-20">
                        <img
                          src={file.url}
                          alt="preview"
                          className="w-full h-full object-cover rounded-lg border"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(file.uid)}
                          className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                    {fileList.length < MAX_IMAGES && (
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="w-20 h-20 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center text-gray-400 hover:border-primary hover:text-primary transition-colors"
                      >
                        <HiPhoto className="w-8 h-8" />
                      </button>
                    )}
                  </div>
                </div>
              ),
            },
            {
              key: "article",
              label: "Article",
              children: (
                <div className="flex flex-col gap-3">
                  <Input
                    placeholder="Title"
                    value={form.title}
                    onChange={(e) =>
                      setForm({ ...form, title: e.target.value })
                    }
                    className="font-semibold"
                  />
                  <Editor
                    apiKey="gzbaq6k6otgk5w4c2vhnm06gksbkpyt5ahllriq2s49rj3ty"
                    value={form.content}
                    onEditorChange={(val) =>
                      setForm({ ...form, content: val })
                    }
                    init={{
                      height: 200,
                      menubar: false,
                      plugins:
                        "advlist autolink lists link image charmap preview anchor searchreplace visualblocks code fullscreen insertdatetime media table help wordcount",
                      toolbar:
                        "undo redo | formatselect | bold italic underline | alignleft aligncenter alignright | bullist numlist | link image media table | code preview fullscreen",
                    }}
                  />
                </div>
              ),
            },
          ]}
        />

        {/* OG Preview */}
        {ogPreview && (
          <div
            className="mt-3 og-preview"
            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(ogPreview) }}
          />
        )}

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          hidden
          onChange={handleFileSelect}
        />

        {/* Footer */}
        <div className="flex justify-end mt-4 gap-2">
          <Button onClick={handleClose}>Cancel</Button>
          <Button
            type="primary"
            icon={<HiPaperAirplane className="w-4 h-4" />}
            loading={isLoading}
            disabled={isEmpty}
            onClick={handleSubmit}
          >
            {isEditMode ? "Update" : "Post"}
          </Button>
        </div>
      </Modal>
    </>
  );
};

export default CreatePostComponent;
