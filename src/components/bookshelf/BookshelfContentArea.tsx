import React from "react";
import { Breadcrumb, Row, Col, Empty, Skeleton, Typography, theme } from "antd";
import BookshelfItemCard from "./BookshelfItemCard";
import type { BookshelfFolder } from "../../types/bookshelf.types";
import { FolderOpenOutlined, RightOutlined } from "@ant-design/icons";

const { Title } = Typography;
const { useToken } = theme;

type BookshelfContentAreaProps = {
  activeFolder: BookshelfFolder | null;
  loading: boolean;
  onSelectFolder: (folderId: number) => void;
  breadcrumbs: { id: number; name: string }[];
};

const BookshelfContentArea: React.FC<BookshelfContentAreaProps> = ({
  activeFolder,
  loading,
  onSelectFolder,
  breadcrumbs,
}) => {
  const { token } = useToken();

  if (loading) {
    return (
      <div style={{ padding: 32 }}>
        <Skeleton active paragraph={{ rows: 6 }} />
      </div>
    );
  }

  if (!activeFolder) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
          padding: 24,
        }}
      >
        <Empty
          image={<FolderOpenOutlined style={{ fontSize: 72, color: token.colorBorder }} />}
          description={
            <span style={{ color: token.colorTextSecondary, fontSize: 16 }}>
              Select a folder from the sidebar or create a new one.
            </span>
          }
        />
      </div>
    );
  }

  const hasContent =
    activeFolder.subfolders.length > 0 || activeFolder.items.length > 0;

  return (
    <div style={{ padding: "32px 40px", height: "100%", overflowY: "auto", position: "relative" }}>
      {/* Breadcrumbs */}
      <Breadcrumb 
        style={{ marginBottom: 32, fontSize: 15 }} 
        separator={<RightOutlined style={{ fontSize: 10, color: token.colorTextTertiary }} />}
        items={breadcrumbs.map((bc, index) => {
          const isLast = index === breadcrumbs.length - 1;
          return {
            key: bc.id || "root_" + index,
            title: (
              <span
                style={{
                  cursor: isLast ? "default" : "pointer",
                  fontWeight: isLast ? 600 : 400,
                  color: isLast ? token.colorText : token.colorTextSecondary,
                  transition: "color 0.2s"
                }}
                onClick={() => {
                  if (!isLast) {
                    onSelectFolder(bc.id);
                  }
                }}
              >
                {bc.name}
              </span>
            )
          };
        })}
      />

      <Title level={4} style={{ marginBottom: 32, fontWeight: 700, color: token.colorTextHeading }}>
        {activeFolder.name}
      </Title>

      {!hasContent ? (
        <Empty
          description={
            <span style={{ color: token.colorTextSecondary }}>
              This folder is empty
            </span>
          }
          style={{ marginTop: 80 }}
        />
      ) : (
        <>
          {/* Subfolders Grid */}
          {activeFolder.subfolders.length > 0 && (
            <div style={{ marginBottom: 40 }}>
              <Typography.Text 
                type="secondary" 
                style={{ 
                  display: "block", 
                  marginBottom: 16, 
                  fontSize: 13, 
                  fontWeight: 600, 
                  textTransform: "uppercase", 
                  letterSpacing: "0.5px"
                }}
              >
                Folders
              </Typography.Text>
              <Row gutter={[20, 20]}>
                {activeFolder.subfolders.map((sf) => (
                  <Col xs={24} sm={12} md={8} lg={6} xl={4} key={`subfolder-${sf.id}`}>
                    <BookshelfItemCard
                      isFolder={true}
                      folder={sf}
                      onClick={() => onSelectFolder(sf.id)}
                    />
                  </Col>
                ))}
              </Row>
            </div>
          )}

          {/* Items / Links Grid */}
          {activeFolder.items.length > 0 && (
            <div>
              <Typography.Text 
                type="secondary" 
                style={{ 
                  display: "block", 
                  marginBottom: 16, 
                  fontSize: 13, 
                  fontWeight: 600, 
                  textTransform: "uppercase", 
                  letterSpacing: "0.5px" 
                }}
              >
                Files
              </Typography.Text>
              <Row gutter={[20, 20]}>
                {activeFolder.items.map((it) => (
                  <Col xs={24} sm={12} md={8} lg={6} xl={4} key={`item-${it.id}`}>
                    <BookshelfItemCard isFolder={false} item={it} />
                  </Col>
                ))}
              </Row>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default BookshelfContentArea;
