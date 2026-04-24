import { ArrowLeftOutlined } from "@ant-design/icons";
import { useRouter } from "@tanstack/react-router";
import { Button, Card, Segmented, Space, Tooltip, Typography } from "antd";
import { Plus } from "lucide-react";
import {
  PageCategory,
  PageOverviewTypes,
} from "../../../types/impulse/page.types";

const { Text } = Typography;

interface PagesFilterCardProps {
  pageType: PageOverviewTypes | null;
  pageCategory: PageCategory | null;
  onTypeChange: (val: string) => void;
  onCategoryChange: (val: string) => void;
  openAddPage: boolean;
  setOpenAddPage: (val: boolean) => void;
}

const PagesFilterCard = ({
  pageType,
  pageCategory,
  onTypeChange,
  onCategoryChange,
  openAddPage,
  setOpenAddPage,
}: PagesFilterCardProps) => {
  const router = useRouter();

  return (
    <Card
      variant={"outlined"}
      style={{
        borderRadius: "12px",
        boxShadow: "0 4px 20px rgba(0,0,0,0.03)",
        background: "rgba(255, 255, 255, 0.9)",
        backdropFilter: "blur(10px)",
      }}
      styles={{ body: { padding: "16px 24px" } }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "24px",
        }}
      >
        <Space align="center" size="large" wrap>
          <Tooltip title="Go Back">
            <Button
              icon={<ArrowLeftOutlined />}
              onClick={() => router.history.back()}
              type="text"
              style={{ padding: "4px 8px", marginRight: "8px" }}
            />
          </Tooltip>
          <Space align="center" size="middle" wrap>
            <Text type="secondary" strong>
              View
            </Text>
            <Segmented
              value={pageType || "all"}
              onChange={onTypeChange}
              options={[
                { label: "All Pages", value: "all" },
                { label: "My Pages", value: PageOverviewTypes.MY_PAGES },
                {
                  label: "Followed Pages",
                  value: PageOverviewTypes.FOLLOWED_PAGES,
                },
              ]}
              size="large"
              style={{ background: "#f0f2f5" }}
            />
          </Space>
        </Space>

        <Space align="center" size="middle" wrap>
          <Text type="secondary" strong>
            Category
          </Text>
          <Segmented
            value={pageCategory || "all"}
            onChange={onCategoryChange}
            options={[
              { label: "All Categories", value: "all" },
              { label: "Company", value: PageCategory.COMPANY },
              { label: "Event", value: PageCategory.EVENT },
              { label: "Community", value: PageCategory.COMMUNITY },
              { label: "General", value: PageCategory.GENERAL },
            ]}
            size="large"
            style={{ background: "#f0f2f5" }}
          />
        </Space>
        {pageType !== PageOverviewTypes.FOLLOWED_PAGES && (
          <Button type="primary" onClick={() => setOpenAddPage(!openAddPage)}>
            <Plus />
            Create Page
          </Button>
        )}
      </div>
    </Card>
  );
};

export default PagesFilterCard;
