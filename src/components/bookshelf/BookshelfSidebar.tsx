import React, { useMemo } from "react";
import { Tree, Input, theme } from "antd";
import type { DataNode } from "antd/es/tree";
import { FolderFilled, FolderOpenFilled } from "@ant-design/icons";
import type { BookshelfFolder } from "../../types/bookshelf.types";

const { Search } = Input;
const { useToken } = theme;

type BookshelfSidebarProps = {
  treeData: BookshelfFolder[];
  selectedFolderId: number | null;
  onSelectFolder: (id: number) => void;
};

const BookshelfSidebar: React.FC<BookshelfSidebarProps> = ({
  treeData,
  selectedFolderId,
  onSelectFolder,
}) => {
  const { token } = useToken();
  const [expandedKeys, setExpandedKeys] = React.useState<React.Key[]>([]);
  const [searchValue, setSearchValue] = React.useState("");

  // Convert API BookshelfFolder[] to Ant Design DataNode[] recursively
  const getTreeData = (folders: BookshelfFolder[]): DataNode[] => {
    return folders.map((folder) => {
      const isMatch = folder.name
        .toLowerCase()
        .includes(searchValue.toLowerCase());
      const title =
        searchValue && isMatch ? (
          <span style={{ color: token.colorPrimary, fontWeight: 600 }}>
            {folder.name}
          </span>
        ) : (
          <span style={{ fontWeight: 500, color: token.colorText }}>
            {folder.name}
          </span>
        );

      return {
        title,
        key: folder.id,
        icon: ({ expanded }) => (
          <span
            style={{
              fontSize: 16,
              color: expanded ? token.colorPrimary : token.colorIcon,
            }}
          >
            {expanded ? <FolderOpenFilled /> : <FolderFilled />}
          </span>
        ),
        children: folder.subfolders?.length
          ? getTreeData(folder.subfolders)
          : [],
        isLeaf: folder.subfolders?.length === 0,
      };
    });
  };

  const formattedData = useMemo(
    () => getTreeData(treeData),
    [treeData, searchValue, token],
  );

  // Recursively find keys to expand if search is used
  const filterExpandedKeys = (folders: BookshelfFolder[], search: string) => {
    const keys: React.Key[] = [];
    folders.forEach((f) => {
      const childrenMatch = f.subfolders && f.subfolders.length > 0;
      if (childrenMatch) {
        keys.push(...filterExpandedKeys(f.subfolders, search));
      }
      if (
        f.name.toLowerCase().includes(search.toLowerCase()) &&
        f.parent !== null
      ) {
        keys.push(f.parent);
      }
    });
    return keys;
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setSearchValue(value);
    if (value) {
      const newExpandedKeys = filterExpandedKeys(treeData, value);
      setExpandedKeys(newExpandedKeys);
    } else {
      setExpandedKeys(selectedFolderId ? [selectedFolderId] : []);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div
        style={{
          padding: "20px 24px",
          borderBottom: `1px solid ${token.colorBorderSecondary}`,
        }}
      >
        <Search
          style={{ width: "100%" }}
          placeholder="Search folders"
          onChange={onChange}
          size="large"
          allowClear
          variant="filled" // updated from flat string "bordered" or default to modern "filled"
        />
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "16px 12px" }}>
        {treeData.length > 0 ? (
          <Tree
            showIcon
            blockNode
            onExpand={(keys) => setExpandedKeys(keys)}
            expandedKeys={expandedKeys}
            selectedKeys={selectedFolderId ? [selectedFolderId] : []}
            onSelect={(selectedKeys) => {
              if (selectedKeys.length > 0) {
                onSelectFolder(Number(selectedKeys[0]));
              }
            }}
            treeData={formattedData}
            style={{ background: "transparent" }}
          />
        ) : (
          <p
            style={{
              textAlign: "center",
              color: token.colorTextSecondary,
              marginTop: 40,
              fontSize: 13,
            }}
          >
            No folders found.
          </p>
        )}
      </div>
    </div>
  );
};

export default BookshelfSidebar;
