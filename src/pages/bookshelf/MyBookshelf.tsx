import React, { useEffect, useState, useMemo } from "react";
import { Layout, Button, Typography, message, Space, theme, Grid, Drawer } from "antd";
import { PlusOutlined, LinkOutlined, MenuOutlined } from "@ant-design/icons";
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

  const storedFolderId = localStorage.getItem("bookshelf_active_folder");
  const [activeFolderId, setActiveFolderId] = useState<number | null>(
    storedFolderId ? Number(storedFolderId) : null
  );

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
  const handleSelectFolder = (id: number) => {
    setActiveFolderId(id);
    localStorage.setItem("bookshelf_active_folder", String(id));
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
    path: { id: number; name: string }[] = []
  ): { folder: BookshelfFolder; path: { id: number; name: string }[] } | null => {
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
    if (!activeFolderId || treeData.length === 0) return null;
    return findFolderData(treeData, activeFolderId);
  }, [treeData, activeFolderId]);

  return (
    <Layout style={{ height: "calc(100vh - 64px)", background: token.colorBgLayout || "#f0f2f5" }}>
      {/* Top Action Bar */}
      <div
        style={{
          padding: "16px 24px",
          background: token.colorBgContainer || "#fff",
          borderBottom: `1px solid ${token.colorBorderSecondary || "#f0f0f0"}`,
          display: "flex",
          flexWrap: "wrap",
          gap: 16,
          justifyContent: "space-between",
          alignItems: "center",
          boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
          zIndex: 10,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {isMobile && (
            <Button 
              type="text" 
              icon={<MenuOutlined />} 
              onClick={() => setIsMobileSidebarOpen(true)}
              style={{ fontSize: 18, padding: "0 8px" }}
            />
          )}
          <Title level={3} style={{ margin: 0, fontWeight: 600 }}>
            Bookshelf
          </Title>
        </div>
        
        <Space wrap style={{ flex: isMobile ? 1 : "none", justifyContent: isMobile ? "flex-end" : "flex-start", width: isMobile ? "100%" : "auto" }}>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            size={isMobile ? "middle" : "large"}
            onClick={() => setIsFolderModalOpen(true)}
            style={{ borderRadius: 8, fontWeight: 500 }}
          >
            Folder
          </Button>
          <Button
            size={isMobile ? "middle" : "large"}
            icon={<LinkOutlined />}
            style={{ borderRadius: 8, fontWeight: 500 }}
            onClick={() => {
              if (!activeFolderId) {
                message.warning("Please select a folder first to add a file.");
                return;
              }
              setIsLinkModalOpen(true);
            }}
          >
            File
          </Button>
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
          />
        </Content>

        {/* Desktop Sidebar */}
        {!isMobile && (
          <Sider
            width={300}
            theme="light"
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
        title="Bookshelf Navigation"
        placement="right"
        onClose={() => setIsMobileSidebarOpen(false)}
        open={isMobileSidebarOpen}
        bodyStyle={{ padding: 0 }}
        width={300}
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
        parentId={activeFolderId}
        onSuccess={handleCreateSuccess}
      />
      
      {activeFolderId && (
        <AddFileLinkModal
          open={isLinkModalOpen}
          onClose={() => setIsLinkModalOpen(false)}
          folderId={activeFolderId}
          onSuccess={handleCreateSuccess}
        />
      )}
    </Layout>
  );
};

export default MyBookshelf;
