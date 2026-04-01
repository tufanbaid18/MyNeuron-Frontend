import React from "react";
import {
  FileTextOutlined,
  FilePdfOutlined,
  FileImageOutlined,
  FileWordOutlined,
  FileExcelOutlined,
  LinkOutlined,
  FileOutlined,
} from "@ant-design/icons";

type FileExtensionIconProps = {
  url?: string | null;
  title?: string | null;
  className?: string;
  style?: React.CSSProperties;
};

const FileExtensionIcon: React.FC<FileExtensionIconProps> = ({
  url,
  title,
  className,
  style,
}) => {
  const getExtension = (path?: string | null) => {
    if (!path) return "";
    try {
      // If it's a URL, get pathname
      const urlObj = new URL(path);
      const parts = urlObj.pathname.split(".");
      if (parts.length > 1) {
        return parts.pop()?.toLowerCase() || "";
      }
    } catch {
      // Not a valid URL, maybe just a file name
      const parts = path.split(".");
      if (parts.length > 1) {
        return parts.pop()?.toLowerCase() || "";
      }
    }
    return "";
  };

  const ext = getExtension(url) || getExtension(title);

  const getIcon = () => {
    switch (ext) {
      case "pdf":
        return <FilePdfOutlined className={className} style={{ color: "#f5222d", ...style }} />;
      case "doc":
      case "docx":
        return <FileWordOutlined className={className} style={{ color: "#1890ff", ...style }} />;
      case "xls":
      case "xlsx":
      case "csv":
        return <FileExcelOutlined className={className} style={{ color: "#52c41a", ...style }} />;
      case "png":
      case "jpg":
      case "jpeg":
      case "gif":
      case "svg":
        return <FileImageOutlined className={className} style={{ color: "#13c2c2", ...style }} />;
      case "txt":
      case "md":
        return <FileTextOutlined className={className} style={{ color: "#8c8c8c", ...style }} />;
      default:
        if (url && url.startsWith("http")) {
          return <LinkOutlined className={className} style={{ color: "#722ed1", ...style }} />;
        }
        return <FileOutlined className={className} style={{ color: "#8c8c8c", ...style }} />;
    }
  };

  return getIcon();
};

export default FileExtensionIcon;
