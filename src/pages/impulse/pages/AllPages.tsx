import { useSearch } from "@tanstack/react-router";
import { Card, Col, Empty, Row, Skeleton, Space } from "antd";
import { useState } from "react";
import AddPageModal from "../../../components/impulse/pages/AddPageModal";
import PageItemCard from "../../../components/impulse/pages/PageItemCard";
import PagesFilterCard from "../../../components/impulse/pages/PagesFilterCard";
import {
  useFollowPage,
  usePagesByFilter,
  useUnfollowPage,
} from "../../../hooks/impulse/usePages";
import { impulseAllPagesRoute } from "../../../routes/impulse.routes";
import {
  PageCategory,
  PageOverviewTypes,
} from "../../../types/impulse/page.types";

const AllPages = () => {
  const [openAddPage, setOpenAddPage] = useState<boolean>(false);

  let { filter } = useSearch({ from: impulseAllPagesRoute.id });
  if (filter && filter === PageOverviewTypes.ALL_PAGES) {
    filter = null;
  }

  const [pageCategory, setPageCategory] = useState<PageCategory | null>(null);
  const [pageType, setPageType] = useState<PageOverviewTypes | null>(
    filter as PageOverviewTypes | null,
  );

  const { data: pages, isLoading } = usePagesByFilter({
    category: pageCategory || undefined,
    type: pageType || undefined,
  });

  const followMutation = useFollowPage();
  const unfollowMutation = useUnfollowPage();

  const handleFollowToggle = (pageId: number, isFollowing: boolean) => {
    if (isFollowing) {
      unfollowMutation.mutate(pageId);
    } else {
      followMutation.mutate(pageId);
    }
  };

  const handleTypeChange = (val: string) => {
    setPageType(val === "all" ? null : (val as PageOverviewTypes));
  };

  const handleCategoryChange = (val: string) => {
    setPageCategory(val === "all" ? null : (val as PageCategory));
  };

  return (
    <div style={{ padding: "24px", margin: "0 auto" }}>
      <Space orientation="vertical" size="large" style={{ width: "100%" }}>
        <PagesFilterCard
          pageType={pageType}
          pageCategory={pageCategory}
          onTypeChange={handleTypeChange}
          onCategoryChange={handleCategoryChange}
          openAddPage={openAddPage}
          setOpenAddPage={setOpenAddPage}
        />

        {isLoading ? (
          <Row gutter={[16, 16]}>
            {[1, 2, 3, 4, 5, 6].map((key) => (
              <Col xs={24} sm={12} md={8} key={key}>
                <Card>
                  <Skeleton loading={true} avatar active />
                </Card>
              </Col>
            ))}
          </Row>
        ) : pages && pages.length > 0 ? (
          <Row gutter={[24, 24]}>
            {pages.map((page) => (
              <Col xs={24} sm={12} lg={8} key={page.id}>
                <PageItemCard
                  page={page}
                  onFollowToggle={handleFollowToggle}
                  isPending={
                    followMutation.isPending || unfollowMutation.isPending
                  }
                />
              </Col>
            ))}
          </Row>
        ) : (
          <Empty
            description="No pages found matching your filters."
            style={{ margin: "40px 0" }}
          />
        )}
      </Space>
      <AddPageModal
        open={openAddPage}
        onCancel={() => setOpenAddPage(!openAddPage)}
      />
    </div>
  );
};

export default AllPages;
