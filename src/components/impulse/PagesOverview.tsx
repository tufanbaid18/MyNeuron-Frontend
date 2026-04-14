import { useNavigate } from "@tanstack/react-router";
import { Button, Card, Typography } from "antd";
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
      <div className="w-full flex justify-between items-center ">
        <Typography className="font-semibold">Pages</Typography>
        <Button
          className="border-none!  p-0! m-0!"
          title="View all activity"
          onClick={() =>
            handleOnClickViewAll({ type: PageOverviewTypes.MY_PAGES })
          }
        >
          <ChevronRight />
        </Button>
      </div>
      <div>
        {error ? (
          <ErrorComponent />
        ) : (
          <div className="flex flex-col items-stretch">
            {pages.map((item: PageOverviewItem, index: number) => (
              <div
                key={index}
                className="flex justify-between rounded-lg items-center p-3 cursor-pointer hover:bg-gray-100"
                onClick={() => handleOnClickViewAll({ type: item.type })}
              >
                <div className="flex gap-2 justify-center items-center">
                  <Typography className="text-primary!">{item.icon}</Typography>
                  <Typography>{item.heading}</Typography>
                </div>
                <Typography>{item.data}</Typography>
              </div>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
};

export default PagesOverview;
