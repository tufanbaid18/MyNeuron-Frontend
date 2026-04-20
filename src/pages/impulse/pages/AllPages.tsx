import { useSearch } from "@tanstack/react-router";
import { impulseAllPagesRoute } from "../../../routes/impulse.routes";
import { PageOverviewTypes } from "../../../types/impulse/page.types";

const AllPages = () => {
  let { filter } = useSearch({ from: impulseAllPagesRoute.id });
  if (filter && filter === PageOverviewTypes.ALL_PAGES) {
    filter = null;
  }
  // const [pageCategory, setPageCategory] = useState<PageCategory | null>(null);
  // const [pageType, _setPageType] = useState<PageOverviewTypes | null>(
  //   filter as PageOverviewTypes | null,
  // );
  return <div>{JSON.stringify(filter)}</div>;
  // return <div>{JSON.stringify({ pageType, pageCategory })}</div>;
};

export default AllPages;
