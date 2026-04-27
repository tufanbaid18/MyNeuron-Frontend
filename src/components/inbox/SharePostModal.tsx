import { CheckOutlined, CopyOutlined, SendOutlined, ShareAltOutlined, UserOutlined } from "@ant-design/icons";
import { useRouter } from "@tanstack/react-router";
import { Avatar, Button, Input, Modal, Spin, Typography } from "antd";
import { useCallback, useState } from "react";
import toast from "react-hot-toast";
import { useSendMessage } from "../../hooks/inbox/useInbox";
import { useUserSearch } from "../../hooks/user/useUserProfile";
import { getAvatarByName } from "../../utils/avatar.utils";

const { Text } = Typography;

interface SharePostModalProps {
  open: boolean;
  onClose: () => void;
  postUrl: string;
  postTitle?: string;
}

const CopyLinkButton = ({ url }: { url: string }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success("Link copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy link.");
    }
  }, [url]);

  return (
    <Button
      type="text"
      size="small"
      icon={copied ? <CheckOutlined className="text-emerald-600" /> : <CopyOutlined className="text-slate-500" />}
      onClick={handleCopy}
      title="Copy link"
      className="shrink-0"
    />
  );
};

export const SharePostModal = ({
  open,
  onClose,
  postUrl,
  postTitle,
}: SharePostModalProps) => {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [hasSearched, setHasSearched] = useState(false);
  const [sendingTo, setSendingTo] = useState<number | null>(null);
  const { data: users = [], isLoading } = useUserSearch(search);

  // We create a temporary send hook — the userId is set on selection
  const sendMsg = useSendMessage(sendingTo);

  const handleSearch = (value: string) => {
    setSearch(value);
    if (value.trim()) {
      setHasSearched(true);
    }
  };

  const handleClose = () => {
    setSearch("");
    setHasSearched(false);
    setSendingTo(null);
    onClose();
  };

  const handleSelectUser = (userId: number) => {
    setSendingTo(userId);

    // Send the post URL as the message content
    const messageContent = postUrl;

    sendMsg.mutate(
      { receiver: userId, content: messageContent },
      {
        onSuccess: () => {
          toast.success("Post shared successfully!");
          handleClose();
          router.navigate({ to: `/inbox/${userId}` });
        },
        onError: () => {
          toast.error("Failed to share post. Please try again.");
          setSendingTo(null);
        },
      },
    );
  };

  return (
    <Modal
      title={
        <div className="flex items-center gap-2">
          <ShareAltOutlined className="text-emerald-600" />
          <span>Share Post</span>
        </div>
      }
      open={open}
      onCancel={handleClose}
      footer={null}
      destroyOnHidden
      className="share-post-modal"
    >
      <div className="flex flex-col gap-4">
        {/* Post preview snippet */}
        <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">
            <SendOutlined className="text-lg" />
          </div>
          <div className="flex min-w-0 flex-1 flex-col">
            <Text strong className="truncate text-sm text-slate-700">
              {postTitle || "Impulse Post"}
            </Text>
            <Text className="truncate text-xs text-slate-400">{postUrl}</Text>
          </div>
          <CopyLinkButton url={postUrl} />
        </div>

        {/* Search input */}
        <Input.Search
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
          allowClear
          enterButton="Search"
          loading={isLoading}
        />

        {/* User list */}
        <div className="max-h-[300px] overflow-y-auto">
          {sendingTo ? (
            <div className="flex items-center justify-center py-8">
              <Spin tip="Sending..." />
            </div>
          ) : isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Spin />
            </div>
          ) : hasSearched && users.length === 0 ? (
            <div className="py-8 text-center text-slate-400">
              <Text className="text-slate-400">No users found</Text>
            </div>
          ) : !hasSearched ? (
            <div className="py-8 text-center text-slate-400">
              <Text className="text-slate-400">
                Search for someone to share this post with
              </Text>
            </div>
          ) : (
            <div className="flex flex-col gap-1">
              {users.map((user) => (
                <button
                  key={user.id}
                  onClick={() => handleSelectUser(user.id)}
                  className="flex w-full cursor-pointer items-center gap-3 rounded-xl p-3 text-left transition-colors hover:bg-slate-100"
                >
                  <Avatar
                    size={40}
                    src={
                      user.profile_image ||
                      getAvatarByName({
                        firstName: user.first_name,
                        lastName: user.last_name,
                      })
                    }
                    icon={<UserOutlined />}
                    className="shrink-0"
                  />
                  <div className="flex min-w-0 flex-1 flex-col">
                    <Text strong className="truncate text-sm text-slate-800">
                      {user.first_name} {user.last_name}
                    </Text>
                    <Text className="truncate text-xs text-slate-500">
                      {user.email}
                    </Text>
                  </div>
                  <SendOutlined className="shrink-0 text-slate-400" />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};
