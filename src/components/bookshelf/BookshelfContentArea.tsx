import React from "react";
import { Breadcrumb, Row, Col, Empty, Skeleton, Typography, theme } from "antd";
import BookshelfItemCard from "./BookshelfItemCard";
import type { BookshelfFolder } from "../../types/bookshelf.types";
import { RightOutlined } from "@ant-design/icons";

const { Title } = Typography;
const { useToken } = theme;

type BookshelfContentAreaProps = {
  activeFolder: BookshelfFolder | null;
  loading: boolean;
  onSelectFolder: (folderId: number | null) => void;
  breadcrumbs: { id: number | null; name: string }[];
  onRefresh: () => void;
};

const BookshelfContentArea: React.FC<BookshelfContentAreaProps> = ({
  activeFolder,
  loading,
  onSelectFolder,
  breadcrumbs,
  onRefresh,
}) => {
  const { token } = useToken();

  if (loading) {
    return (
      <div style={{ padding: 32 }}>
        <Skeleton active paragraph={{ rows: 6 }} />
      </div>
    );
  }

  if (loading || !activeFolder) {
    return (
      <div style={{ padding: 32 }}>
        <Skeleton active paragraph={{ rows: 6 }} />
      </div>
    );
  }

  const hasContent =
    activeFolder.subfolders.length > 0 || activeFolder.items.length > 0;

  return (
    <div style={{ padding: "16px 20px", height: "100%", overflowY: "auto", position: "relative" }}>
      {/* Breadcrumbs */}
      <Breadcrumb 
        style={{ marginBottom: 16, fontSize: 13 }} 
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

      <Title level={5} style={{ marginBottom: 16, fontWeight: 700, color: token.colorTextHeading }}>
        {activeFolder.name}
      </Title>

      {!hasContent ? (
        <Empty
          description={
            <span style={{ color: token.colorTextSecondary }}>
              This folder is empty
            </span>
          }
          style={{ marginTop: 40 }}
        />
      ) : (
        <>
          {/* Subfolders Grid */}
          {activeFolder.subfolders.length > 0 && (
            <div style={{ marginBottom: 24 }}>
              <Typography.Text 
                type="secondary" 
                style={{ 
                  display: "block", 
                  marginBottom: 12, 
                  fontSize: 12, 
                  fontWeight: 600, 
                  textTransform: "uppercase", 
                  letterSpacing: "0.5px"
                }}
              >
                Folders
              </Typography.Text>
              <Row gutter={[12, 12]}>
                {activeFolder.subfolders.map((sf) => (
                  <Col xs={24} sm={12} md={8} lg={6} xl={4} key={`subfolder-${sf.id}`}>
                    <BookshelfItemCard
                      isFolder={true}
                      folder={sf}
                      onClick={() => onSelectFolder(sf.id)}
                      onRefresh={onRefresh}
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
                  marginBottom: 12, 
                  fontSize: 12, 
                  fontWeight: 600, 
                  textTransform: "uppercase", 
                  letterSpacing: "0.5px" 
                }}
              >
                Files
              </Typography.Text>
              <Row gutter={[12, 12]}>
                {activeFolder.items.map((it) => (
                  <Col xs={24} sm={12} md={8} lg={6} xl={4} key={`item-${it.id}`}>
                    <BookshelfItemCard 
                      isFolder={false} 
                      item={it} 
                      onRefresh={onRefresh}
                    />
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
