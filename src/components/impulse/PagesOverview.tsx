import { useNavigate } from "@tanstack/react-router";
import { Button, Card, Tooltip, Typography } from "antd";
import { ChevronRight } from "lucide-react";
import { useMemo } from "react";
import { APP_ROUTES } from "../../constants/app.routes";
import { getPagesOverviewItems } from "../../constants/pages.constants";
import { usePagesOverview } from "../../hooks/impulse/usePages";
import {
  type PageOverviewItem,
  PageOverviewTypes,
} from "../../types/impulse/page.types";
import ErrorComponent from "../ui/ErrorComponent";

const { Text } = Typography;

const PagesOverview = () => {
  const { data, isLoading, isFetching, error } = usePagesOverview();
  const navigate = useNavigate();

  const handleOnClickViewAll = ({ type }: { type?: PageOverviewTypes }) => {
    if (!type) {
      type = PageOverviewTypes.MY_PAGES;
    }
    navigate({
      to: APP_ROUTES.MY_ACTIVITY,
      search: { filter: type },
    });
  };

  const pages: PageOverviewItem[] = useMemo(() => {
    return getPagesOverviewItems({ error, isLoading, isFetching, data });
  }, [data, isLoading, isFetching, error]);

  return (
    <Card>
      <div
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Text strong>Pages</Text>
        <Button
          type="text"
          size="small"
          title="View all activity"
          icon={<ChevronRight style={{ width: 18, height: 18 }} />}
          onClick={() =>
            handleOnClickViewAll({ type: PageOverviewTypes.MY_PAGES })
          }
          style={{ padding: 0 }}
        />
      </div>
      <div>
        {error ? (
          <ErrorComponent />
        ) : (
          <div style={{ display: "flex", flexDirection: "column" }}>
            {pages.map((item: PageOverviewItem, index: number) => (
              <div
                key={index}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "10px 12px",
                  borderRadius: 8,
                  cursor: "pointer",
                  gap: 8,
                  minWidth: 0,
                }}
                className={`hover:bg-gray-100 dark:hover:bg-gray-800 transition-all`}
             onClick={() => handleOnClickViewAll({ type: item.type })}
              >
                <div
                  style={{
                    display: "flex",
                    gap: 8,
                    alignItems: "center",
                    minWidth: 0,
                    flex: 1,
                    overflow: "hidden",
                  }}
                >
                  <span
                    style={{
                      flexShrink: 0,
                      color: "var(--primary)",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    {item.icon}
                  </span>
                  <Tooltip title={item.heading}>
                    <Text
                      ellipsis
                      style={{
                        display: "block",
                        minWidth: 0,
                        flex: 1,
                        fontSize: 14,
                      }}
                    >
                      {item.heading}
                    </Text>
                  </Tooltip>
                </div>
                <Text style={{ flexShrink: 0, fontWeight: 500, fontSize: 14 }}>
                  {item.data}
                </Text>
              </div>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
};

export default PagesOverview;
