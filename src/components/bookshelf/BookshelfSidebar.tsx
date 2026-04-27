import { FolderFilled, FolderOpenFilled } from "@ant-design/icons";
import { Input, theme, Tree, Tooltip, Divider } from "antd";
import type { DataNode } from "antd/es/tree";
import React, { useMemo } from "react";
import type { BookshelfFolder, BookshelfItem } from "../../types/bookshelf.types";
import FileExtensionIcon from "./FileExtensionIcon";

const { Search } = Input;
const { useToken } = theme;

type BookshelfSidebarProps = {
  treeData: BookshelfFolder[];
  selectedFolderId: number | null;
  onSelectFolder: (id: number | null) => void;
};

// Flatten all items from the entire folder tree, tracking which folder each belongs to
type FlatItem = BookshelfItem & { folderName: string; folderId: number };

const collectAllItems = (
  folders: BookshelfFolder[],
  acc: FlatItem[] = [],
): FlatItem[] => {
  for (const folder of folders) {
    if (folder.items?.length) {
      for (const item of folder.items) {
        acc.push({ ...item, folderName: folder.name, folderId: folder.id });
      }
    }
    if (folder.subfolders?.length) {
      collectAllItems(folder.subfolders, acc);
    }
  }
  return acc;
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [treeData, searchValue, token],
  );

  // Recursively check if any folder (or subfolder) matches the search term
  const hasAnyFolderMatch = (folders: BookshelfFolder[], search: string): boolean => {
    return folders.some(
      (f) =>
        f.name.toLowerCase().includes(search.toLowerCase()) ||
        (f.subfolders?.length ? hasAnyFolderMatch(f.subfolders, search) : false),
    );
  };

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

  // Compute matching file items when searching
  const matchingFiles = useMemo<FlatItem[]>(() => {
    if (!searchValue.trim()) return [];
    const lower = searchValue.toLowerCase();
    return collectAllItems(treeData).filter(
      (item) =>
        (item.title && item.title.toLowerCase().includes(lower)) ||
        (item.url && item.url.toLowerCase().includes(lower)),
    );
  }, [treeData, searchValue]);

  const hasFolderMatch = searchValue ? hasAnyFolderMatch(treeData, searchValue) : true;
  const hasFileMatch = matchingFiles.length > 0;
  const hasAnyResult = hasFolderMatch || hasFileMatch;

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div
        style={{
          padding: "12px 16px",
          borderBottom: `1px solid ${token.colorBorderSecondary}`,
        }}
      >
        <Search
          style={{ width: "100%" }}
          placeholder="Search folders & files"
          onChange={onChange}
          size="middle"
          allowClear
          variant="filled"
        />
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "12px 8px" }}>
        {treeData.length === 0 ? (
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
        ) : searchValue && !hasAnyResult ? (
          <p
            style={{
              textAlign: "center",
              color: token.colorTextSecondary,
              marginTop: 40,
              fontSize: 13,
            }}
          >
            No result found.
          </p>
        ) : (
          <>
            {/* Folder tree — always show when no search, or when folders match */}
            {(!searchValue || hasFolderMatch) && (
              <>
                {searchValue && (
                  <div
                    style={{
                      fontSize: 11,
                      fontWeight: 600,
                      color: token.colorTextTertiary,
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                      padding: "0 8px 6px",
                    }}
                  >
                    Folders
                  </div>
                )}
                <Tree
                  showIcon
                  blockNode
                  onExpand={(keys) => setExpandedKeys(keys)}
                  expandedKeys={expandedKeys}
                  selectedKeys={selectedFolderId ? [selectedFolderId] : []}
                  onSelect={(selectedKeys) => {
                    if (selectedKeys.length > 0) {
                      onSelectFolder(Number(selectedKeys[0]));
                    } else {
                      onSelectFolder(null);
                    }
                  }}
                  treeData={formattedData}
                  style={{ background: "transparent" }}
                />
              </>
            )}

            {/* File results section */}
            {searchValue && hasFileMatch && (
              <>
                {hasFolderMatch && (
                  <Divider style={{ margin: "8px 0" }} />
                )}
                <div
                  style={{
                    fontSize: 11,
                    fontWeight: 600,
                    color: token.colorTextTertiary,
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    padding: "0 8px 6px",
                  }}
                >
                  Files
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  {matchingFiles.map((item) => (
                    <Tooltip
                      key={item.id}
                      title={item.url || item.title || ""}
                      placement="left"
                      mouseEnterDelay={0.6}
                    >
                      <div
                        onClick={() => onSelectFolder(item.folderId)}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                          padding: "6px 10px",
                          borderRadius: token.borderRadiusSM,
                          cursor: "pointer",
                          transition: "background 0.15s",
                        }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.background =
                            token.colorFillSecondary)
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.background = "transparent")
                        }
                      >
                        <span style={{ fontSize: 15, flexShrink: 0 }}>
                          <FileExtensionIcon url={item.url} title={item.title} />
                        </span>
                        <div
                          style={{
                            flex: 1,
                            minWidth: 0,
                            display: "flex",
                            flexDirection: "column",
                          }}
                        >
                          <span
                            style={{
                              fontSize: 13,
                              fontWeight: 500,
                              color: token.colorText,
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}
                          >
                            {item.title || item.url || "Untitled"}
                          </span>
                          <span
                            style={{
                              fontSize: 11,
                              color: token.colorTextSecondary,
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}
                          >
                            📁 {item.folderName}
                          </span>
                        </div>
                      </div>
                    </Tooltip>
                  ))}
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default BookshelfSidebar;
