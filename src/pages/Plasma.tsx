import { Button } from "antd";
import { useState } from "react";
import { CgBookmark } from "react-icons/cg";
import { IoOpenOutline } from "react-icons/io5";
import { RiFilePdf2Fill } from "react-icons/ri";
import PlasmaDocumentIcon from "../components/icons/PlasmaDocumentIcon";
import PlasmaPdfIcon from "../components/icons/PlasmaPdfIcon";
import PlasmaSearchBar from "../components/plasma/PlasmaSearchbar";
import ErrorComponent from "../components/ui/ErrorComponent";
import Loading from "../components/ui/Loading";
import NoData from "../components/ui/NoData";
import StartSearch from "../components/ui/StartSearch";
import { usePubMedSearch } from "../hooks/plasma/usePlasma";

const Plasma = () => {
  const [search, setSearch] = useState<string>("");
  const [page, _setPage] = useState(1);
  const PAGE_SIZE = 10;

  const { data, isLoading, isError, isFetching } = usePubMedSearch(
    search.trim() ? search : "",
    page,
    PAGE_SIZE,
  );

  return (
    <div className="w-full h-full flex flex-col justify-center items-center bg-background">
      <div className="w-full py-5 flex flex-col justify-center items-center gap-10">
        <img
          src="/plasma.png"
          alt="plasma"
          className="w-[80%] md:w-[65%] lg:w-[60%] xl:w-[35%] dark:bg-white"
        />

        <PlasmaSearchBar search={search} setSearch={setSearch} />
      </div>
      <div className="w-full h-full p-5  flex justify-center items-start overflow-y-auto">
        {isLoading || isFetching ? (
          <Loading />
        ) : isError ? (
          <ErrorComponent />
        ) : (
          <div
            className="w-[90%] flex justify-start items-start gap-2 flex-col pb-5"
            id="articles-container"
          >
            {data && data.articles && data.articles.length > 0 ? (
              data.articles.map((article) => (
                <div
                  key={article.id}
                  id="article"
                  className="w-full h-max flex justify-start items-start gap-5 p-5 rounded-md shadow-md border border-gray-100"
                >
                  <div className="w-max h-full flex justify-center items-start">
                    {article.pdf ? (
                      <PlasmaPdfIcon size={40} />
                    ) : (
                      <PlasmaDocumentIcon size={40} />
                    )}
                  </div>
                  <div
                    id="article-title"
                    className="flex flex-col items-start justify-start gap-1"
                  >
                    <p className="text-xl font-semibold text-primary wrap-break-word">
                      {article.title}
                    </p>
                    <p className="text-sm font-semibold wrap-break-word">
                      {article.authors}
                    </p>
                    <p className="text-sm font-bold text-muted-foreground">
                      {article.journal} ({article.year})
                    </p>
                    <div>
                      {article.abstract && (
                        <details className="w-full group">
                          <summary className="cursor-pointer text-sm font-medium list-none">
                            <span className="group-open:hidden font-medium">
                              {article.abstract.substring(0, 250)}...
                              <span className="text-primary"> Read more</span>
                            </span>
                            <span className="hidden group-open:inline text-primary">
                              Read less
                            </span>
                          </summary>
                          <p className="text-sm mt-2 font-medium">
                            {article.abstract}
                          </p>
                        </details>
                      )}
                    </div>

                    <div
                      id="actions"
                      className="flex justify-start items-start gap-5 mt-3"
                    >
                      {article.pdf ? (
                        <Button
                          className="border-primary! text-primary!"
                          href={article.pdf}
                          target="_blank"
                        >
                          <RiFilePdf2Fill size={20} />
                          Download PDF
                        </Button>
                      ) : (
                        <Button
                          className="border-primary! text-primary!"
                          href={article.pubmed}
                          target="_blank"
                        >
                          <IoOpenOutline size={20} />
                          View on PubMed
                        </Button>
                      )}
                      <Button className="bg-primary! text-white!">
                        <CgBookmark size={20} />
                        Add to Shelf
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            ) : data ? (
              <NoData />
            ) : (
              <StartSearch />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Plasma;
