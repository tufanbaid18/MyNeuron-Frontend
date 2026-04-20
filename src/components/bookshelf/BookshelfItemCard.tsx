import React, { useState } from "react";
import {
  Card,
  Typography,
  Tooltip,
  theme,
  Dropdown,
  Modal,
  Input,
  message,
} from "antd";
import type { MenuProps } from "antd";
import {
  FolderFilled,
  MoreOutlined,
  EditOutlined,
  DeleteOutlined,
  LinkOutlined,
} from "@ant-design/icons";
import FileExtensionIcon from "./FileExtensionIcon";
import type {
  BookshelfFolder,
  BookshelfItem,
} from "../../types/bookshelf.types";
import {
  updateFolder,
  updateFolderItem,
  deleteFolder,
  deleteFolderItem,
} from "../../services/bookshelf/bookshelf.service";

const { Text } = Typography;
const { useToken } = theme;

type BookshelfItemCardProps = {
  isFolder: boolean;
  item?: BookshelfItem;
  folder?: BookshelfFolder;
  onClick?: () => void;
  onRefresh?: () => void;
};

const BookshelfItemCard: React.FC<BookshelfItemCardProps> = ({
  isFolder,
  item,
  folder,
  onClick,
  onRefresh,
}) => {
  const { token } = useToken();
  const name = isFolder ? folder?.name : item?.title || item?.url;
  const isUrl = !isFolder && item?.url;

  const [isRenameModalOpen, setIsRenameModalOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleMenuClick: MenuProps["onClick"] = (e) => {
    e.domEvent.stopPropagation(); // Prevent card click

    if (e.key === "rename") {
      setNewName(name || "");
      setIsRenameModalOpen(true);
    } else if (e.key === "delete") {
      Modal.confirm({
        title: `Delete ${isFolder ? "Folder" : "File"}`,
        content: `Are you sure you want to delete "${name}"?`,
        okText: "Delete",
        okType: "danger",
        cancelText: "Cancel",
        onOk: async () => {
          try {
            if (isFolder && folder) {
              await deleteFolder(folder.id);
            } else if (!isFolder && item) {
              await deleteFolderItem(item.id);
            }
            message.success(
              `${isFolder ? "Folder" : "File"} deleted successfully`,
            );
            onRefresh?.();
          } catch (error) {
            console.error(error);
            message.error("Failed to delete item");
          }
        },
      });
    } else if (e.key === "copy_link" && item?.url) {
      navigator.clipboard
        .writeText(item.url)
        .then(() => {
          message.success("Link copied to clipboard");
        })
        .catch(() => {
          message.error("Failed to copy link");
        });
    }
  };

  const handleRename = async () => {
    if (!newName.trim()) {
      message.error("Name cannot be empty");
      return;
    }

    try {
      setIsSubmitting(true);
      if (isFolder && folder) {
        await updateFolder(folder.id, { name: newName });
      } else if (!isFolder && item) {
        await updateFolderItem(item.id, { title: newName });
      }
      message.success(`${isFolder ? "Folder" : "File"} renamed successfully`);
      setIsRenameModalOpen(false);
      onRefresh?.();
    } catch (error) {
      console.error(error);
      message.error("Failed to rename item");
    } finally {
      setIsSubmitting(false);
    }
  };

  const menuItems: MenuProps["items"] = [
    {
      key: "rename",
      label: "Rename",
      icon: <EditOutlined />,
    },
    ...(!isFolder && item?.url
      ? [
          {
            key: "copy_link",
            label: "Copy link",
            icon: <LinkOutlined />,
          },
        ]
      : []),
    {
      key: "delete",
      label: "Delete",
      icon: <DeleteOutlined />,
      danger: true,
    },
  ];

  return (
    <>
      <Card
        hoverable
        onClick={() => {
          if (isFolder && onClick) {
            onClick();
          } else if (isUrl && item?.url) {
            window.open(item.url, "_blank");
          }
        }}
        styles={{
          body: {
            padding: "12px 14px",
            display: "flex",
            alignItems: "center",
            width: "100%",
            overflow: "hidden",
          },
        }}
        style={{
          borderRadius: 8,
          height: "100%",
          cursor: "pointer",
          minWidth: 0,
          boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
          border: `1px solid ${token.colorBorderSecondary}`,
          transition: "all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "translateY(-4px)";
          e.currentTarget.style.boxShadow = "0 8px 16px rgba(0,0,0,0.06)";
          e.currentTarget.style.borderColor = token.colorPrimary;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.03)";
          e.currentTarget.style.borderColor = token.colorBorderSecondary;
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            width: "100%",
            minWidth: 0,
          }}
        >
          <div
            style={{
              fontSize: 24,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 32,
              height: 32,
              borderRadius: 6,
              background: isFolder
                ? `${token.colorPrimary}15`
                : token.colorBgLayout, // 15 is hex for ~8% opacity
              color: isFolder ? token.colorPrimary : "inherit",
            }}
          >
            {isFolder ? (
              <FolderFilled />
            ) : (
              <FileExtensionIcon title={item?.title} url={item?.url} />
            )}
          </div>
          <div style={{ flex: 1, overflow: "hidden" }}>
            <Tooltip title={name} placement="bottomLeft">
              <Text
                ellipsis
                style={{
                  display: "block",
                  fontWeight: isFolder ? 600 : 500,
                  color: token.colorText,
                  fontSize: 13,
                }}
              >
                {name || "Untitled"}
              </Text>
            </Tooltip>
          </div>

          <div onClick={(e) => e.stopPropagation()}>
            <Dropdown
              menu={{ items: menuItems, onClick: handleMenuClick }}
              trigger={["click"]}
            >
              <div
                style={{
                  padding: "4px 8px",
                  cursor: "pointer",
                  color: token.colorTextSecondary,
                  borderRadius: 4,
                }}
                className="context-menu-trigger"
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = token.colorBgTextHover)
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "transparent")
                }
              >
                <MoreOutlined />
              </div>
            </Dropdown>
          </div>
        </div>
      </Card>

      <Modal
        title={`Rename ${isFolder ? "Folder" : "File"}`}
        open={isRenameModalOpen}
        onOk={handleRename}
        onCancel={() => setIsRenameModalOpen(false)}
        confirmLoading={isSubmitting}
        destroyOnHidden
      >
        <Input
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="Enter new name"
          onPressEnter={handleRename}
          autoFocus
        />
      </Modal>
    </>
  );
};

export default BookshelfItemCard;
