import React from "react";
import { Card, Typography, Tooltip, theme } from "antd";
import { FolderFilled } from "@ant-design/icons";
import FileExtensionIcon from "./FileExtensionIcon";
import type { BookshelfFolder, BookshelfItem } from "../../types/bookshelf.types";

const { Text } = Typography;
const { useToken } = theme;

type BookshelfItemCardProps = {
  isFolder: boolean;
  item?: BookshelfItem;
  folder?: BookshelfFolder;
  onClick?: () => void;
};

const BookshelfItemCard: React.FC<BookshelfItemCardProps> = ({
  isFolder,
  item,
  folder,
  onClick,
}) => {
  const { token } = useToken();
  const name = isFolder ? folder?.name : item?.title || item?.url;
  const isUrl = !isFolder && item?.url;

  return (
    <Card
      hoverable
      onClick={() => {
        if (isFolder && onClick) {
          onClick();
        } else if (isUrl && item?.url) {
          window.open(item.url, "_blank");
        }
      }}
      bodyStyle={{ 
        padding: "12px 14px",
        display: "flex",
        alignItems: "center",
        width: "100%",
        overflow: "hidden"
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
      <div style={{ display: "flex", alignItems: "center", gap: 10, width: "100%", minWidth: 0 }}>
        <div 
          style={{ 
            fontSize: 24, 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "center",
            width: 32,
            height: 32,
            borderRadius: 6,
            background: isFolder ? `${token.colorPrimary}15` : token.colorBgLayout, // 15 is hex for ~8% opacity
            color: isFolder ? token.colorPrimary : "inherit"
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
      </div>
    </Card>
  );
};

export default BookshelfItemCard;
