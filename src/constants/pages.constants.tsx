import { Tag } from "antd";
import { ChevronRight } from "lucide-react";
import type { ReactNode } from "react";
import { CgSpinner } from "react-icons/cg";
import { RiArticleFill, RiArticleLine, RiPagesLine } from "react-icons/ri";
import {
  PageCategory,
  PageOverviewTypes,
  type PagesOverview,
} from "../types/impulse/page.types";

export const getPagesOverviewItems = ({
  error,
  isLoading,
  isFetching,
  data,
}: {
  error: Error | null;
  isLoading: boolean;
  isFetching: boolean;
  data: PagesOverview | undefined;
}) => {
  return error
    ? [
        {
          icon: <RiArticleFill />,
          heading: "Pages",
          data: 0,
          type: PageOverviewTypes.ALL_PAGES,
        },
      ]
    : [
        {
          icon: <RiArticleFill className="w-5 h-5" />,
          heading: "All Pages",
          data: (
            <div className="flex justify-center items-center rounded-full w-8 h-8 bg-primary text-white">
              <ChevronRight style={{ width: 18, height: 18 }} />
            </div>
          ),
          type: PageOverviewTypes.ALL_PAGES,
        },
        {
          icon: <RiPagesLine className="w-5 h-5" />,
          heading: "My Pages",
          data: (
            <div className="flex justify-center items-center rounded-full w-8 h-8 bg-primary text-white">
              {isLoading || isFetching ? (
                <CgSpinner className="w-2 h-2 animate-spin" />
              ) : (
                data?.my_pages
              )}
            </div>
          ),
          type: PageOverviewTypes.MY_PAGES,
        },
        {
          icon: <RiArticleLine className="w-5 h-5" />,
          heading: "Followed Pages",
          data: (
            <div className="flex justify-center items-center rounded-full w-8 h-8 bg-primary text-white">
              {isLoading || isFetching ? (
                <CgSpinner className="w-2 h-2 animate-spin" />
              ) : (
                data?.followed_pages
              )}
            </div>
          ),
          type: PageOverviewTypes.FOLLOWED_PAGES,
        },
      ];
};

export const getPageBatch = (category: PageCategory): ReactNode => {
  return (
    <Tag className="text-xs! font-semibold! text-ellipsis">
      {category.toLocaleUpperCase()}
    </Tag>
  );
};
