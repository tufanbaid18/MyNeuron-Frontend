import { InboxOutlined, UserOutlined } from "@ant-design/icons";
import { Avatar, Input, Modal, Spin, Typography } from "antd";
import { useState } from "react";
import { useUserSearch } from "../../hooks/user/useUserProfile";
import { getAvatarByName } from "../../utils/avatar.utils";

const { Text } = Typography;

interface NewChatModalProps {
  open: boolean;
  onClose: () => void;
  onSelectUser: (userId: number) => void;
}

export const NewChatModal = ({
  open,
  onClose,
  onSelectUser,
}: NewChatModalProps) => {
  const [search, setSearch] = useState("");
  const { data: users = [], isLoading } = useUserSearch(search);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = (value: string) => {
    setSearch(value);
    if (value.trim()) {
      setHasSearched(true);
    }
  };

  const handleClose = () => {
    setSearch("");
    setHasSearched(false);
    onClose();
  };

  return (
    <Modal
      title={
        <div className="flex items-center gap-2">
          <InboxOutlined className="text-emerald-600" />
          <span>New Chat</span>
        </div>
      }
      open={open}
      onCancel={handleClose}
      footer={null}
      destroyOnHidden
      className="new-chat-modal"
    >
      <div className="flex flex-col gap-4">
        <Input.Search
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
          allowClear
          enterButton="Search"
          loading={isLoading}
        />

        <div className="max-h-[300px] overflow-y-auto">
          {isLoading ? (
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
                Type a name or email to find someone to chat with
              </Text>
            </div>
          ) : (
            <div className="flex flex-col gap-1">
              {users.map((user) => (
                <button
                  key={user.id}
                  onClick={() => {
                    onSelectUser(user.id);
                    handleClose();
                  }}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-100 transition-colors text-left w-full cursor-pointer"
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
                  <div className="flex flex-col min-w-0">
                    <Text strong className="text-sm text-slate-800 truncate">
                      {user.first_name} {user.last_name}
                    </Text>
                    <Text className="text-xs text-slate-500 truncate">
                      {user.email}
                    </Text>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};
