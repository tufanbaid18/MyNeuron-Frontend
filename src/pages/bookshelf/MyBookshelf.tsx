import React, { useEffect, useState, useMemo } from "react";
import {
  Layout,
  Button,
  Typography,
  message,
  Space,
  theme,
  Grid,
  Drawer,
} from "antd";
import { PlusOutlined, LinkOutlined, MenuOutlined } from "@ant-design/icons";
import { useNavigate } from "@tanstack/react-router";
import { bookshelfIndexRoute } from "../../routes/bookshelf.routes";
import BookshelfSidebar from "../../components/bookshelf/BookshelfSidebar";
import BookshelfContentArea from "../../components/bookshelf/BookshelfContentArea";
import CreateFolderModal from "../../components/bookshelf/CreateFolderModal";
import AddFileLinkModal from "../../components/bookshelf/AddFileLinkModal";
import { getFoldersTree } from "../../services/bookshelf/bookshelf.service";
import type { BookshelfFolder } from "../../types/bookshelf.types";

const { useToken } = theme;
const { Sider, Content } = Layout;
const { Title } = Typography;
const { useBreakpoint } = Grid;

const MyBookshelf: React.FC = () => {
  const { token } = useToken();
  const screens = useBreakpoint();
  const isMobile = screens.md === false; // If screen is smaller than md (768px)

  const { folderId } = bookshelfIndexRoute.useSearch();
  const navigate = useNavigate();
  const activeFolderId = folderId || null;

  const [treeData, setTreeData] = useState<BookshelfFolder[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const [isFolderModalOpen, setIsFolderModalOpen] = useState(false);
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const fetchTree = async () => {
    try {
      setLoading(true);
      const data = await getFoldersTree();
      setTreeData(data);
    } catch (error) {
      console.error("Failed to fetch bookshelf tree", error);
      message.error("Could not load folders.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTree();
  }, []);

  // Sync active folder
  const handleSelectFolder = (id: number | null) => {
    navigate({ to: "/my-bookshelf", search: { folderId: id || undefined } });
    if (isMobile) {
      setIsMobileSidebarOpen(false); // Auto close sidebar on mobile when folder selected
    }
  };

  const handleCreateSuccess = async () => {
    await fetchTree();
  };

  // Helper to find folder recursively and build breadcrumbs
  const findFolderData = (
    folders: BookshelfFolder[],
    targetId: number,
    path: { id: number | null; name: string }[] = [
      { id: null, name: "Bookshelf" },
    ],
  ): {
    folder: BookshelfFolder;
    path: { id: number | null; name: string }[];
  } | null => {
    for (const folder of folders) {
      const currentPath = [...path, { id: folder.id, name: folder.name }];
      if (folder.id === targetId) {
        return { folder, path: currentPath };
      }
      if (folder.subfolders && folder.subfolders.length > 0) {
        const found = findFolderData(folder.subfolders, targetId, currentPath);
        if (found) return found;
      }
    }
    return null;
  };

  const activeFolderData = useMemo(() => {
    if (treeData.length === 0 && loading) return null;

    if (!activeFolderId) {
      return {
        folder: {
          id: 0, // Virtual ID for root display logic
          name: "My Bookshelf",
          subfolders: treeData,
          items: [],
          parent: null,
        } as BookshelfFolder,
        path: [{ id: null, name: "Bookshelf" }],
      };
    }
    return findFolderData(treeData, activeFolderId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [treeData, activeFolderId, loading]);

  return (
    <Layout
      style={{
        height: "calc(100vh - 64px)",
        background: token.colorBgLayout || "#f0f2f5",
      }}
    >
      {/* Top Action Bar */}
      <div
        style={{
          padding: "12px 16px",
          background: token.colorBgContainer || "#fff",
          borderBottom: `1px solid ${token.colorBorderSecondary || "#f0f0f0"}`,
          display: "flex",
          flexWrap: "wrap",
          gap: 12,
          justifyContent: "space-between",
          alignItems: "center",
          boxShadow: "0 2px 4px rgba(0,0,0,0.02)",
          zIndex: 10,
        }}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          <Title level={4} style={{ margin: 0, fontWeight: 600 }}>
            Bookshelf
          </Title>
        </div>

        <Space
          wrap
          style={{
            flex: isMobile ? 1 : "none",
            justifyContent: "flex-end",
            width: isMobile ? "100%" : "auto",
          }}
        >
          <Button
            type="primary"
            icon={<PlusOutlined />}
            size={isMobile ? "small" : "middle"}
            onClick={() => setIsFolderModalOpen(true)}
            style={{ borderRadius: 6, fontWeight: 500 }}
          >
            Folder
          </Button>
          {activeFolderId && (
            <Button
              size={isMobile ? "small" : "middle"}
              icon={<LinkOutlined />}
              style={{ borderRadius: 6, fontWeight: 500 }}
              onClick={() => {
                if (!activeFolderData) {
                  message.warning(
                    "Please select a folder first to add a file.",
                  );
                  return;
                }
                setIsLinkModalOpen(true);
              }}
            >
              File
            </Button>
          )}
          {isMobile && (
            <Button
              type="text"
              icon={<MenuOutlined />}
              onClick={() => setIsMobileSidebarOpen(true)}
              style={{ fontSize: 16, padding: "0 4px", marginLeft: 4 }}
            />
          )}
        </Space>
      </div>

      <Layout hasSider={!isMobile} style={{ flex: 1, overflow: "hidden" }}>
        {/* Main Content Area */}
        <Content
          style={{
            background: "transparent",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            minWidth: 0, // Crucial for preventing flex children from stretching parent
          }}
        >
          <BookshelfContentArea
            activeFolder={activeFolderData?.folder || null}
            breadcrumbs={activeFolderData?.path || []}
            loading={loading}
            onSelectFolder={handleSelectFolder}
            onRefresh={fetchTree}
          />
        </Content>

        {/* Desktop Sidebar */}
        {!isMobile && (
          <Sider
            width={260}
            theme="light"
            collapsible
            reverseArrow
            breakpoint="lg"
            style={{
              background: token.colorBgContainer || "#fff",
              borderLeft: `1px solid ${token.colorBorderSecondary || "#f0f0f0"}`,
              boxShadow: "-2px 0 8px rgba(0,0,0,0.03)",
            }}
          >
            <BookshelfSidebar
              treeData={treeData}
              selectedFolderId={activeFolderId}
              onSelectFolder={handleSelectFolder}
            />
          </Sider>
        )}
      </Layout>

      {/* Mobile Drawer Sidebar */}
      <Drawer
        title={
          <span style={{ fontWeight: 600, fontSize: 16 }}>
            Bookshelf Navigation
          </span>
        }
        placement="right"
        onClose={() => setIsMobileSidebarOpen(false)}
        open={isMobileSidebarOpen}
        styles={{ body: { padding: 0 } }}
        size={300}
      >
        <BookshelfSidebar
          treeData={treeData}
          selectedFolderId={activeFolderId}
          onSelectFolder={handleSelectFolder}
        />
      </Drawer>

      {/* Modals */}
      <CreateFolderModal
        open={isFolderModalOpen}
        onClose={() => setIsFolderModalOpen(false)}
        parentId={
          activeFolderId && activeFolderData ? activeFolderData.folder.id : null
        }
        onSuccess={handleCreateSuccess}
      />

      {activeFolderData && (
        <AddFileLinkModal
          open={isLinkModalOpen}
          onClose={() => setIsLinkModalOpen(false)}
          folderId={activeFolderData.folder.id}
          onSuccess={handleCreateSuccess}
        />
      )}
    </Layout>
  );
};

export default MyBookshelf;
