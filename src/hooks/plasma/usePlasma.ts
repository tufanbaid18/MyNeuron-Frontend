import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { keepPreviousData } from "@tanstack/react-query";
import { useEffect, useState } from "react";

type Article = {
  id: string;
  pmcid: string | null;
  title: string;
  abstract: string;
  journal: string;
  year: string;
  authors: string;
  pdf: string | null;
  pubmed: string;
};

function useDebounce<T>(value: T, delay: number = 400) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}

export function usePubMedSearch(
  query: string,
  page: number = 1,
  pageSize: number = 10,
) {
  const debouncedQuery = useDebounce(query, 400);

  return useQuery({
    queryKey: ["pubmed", debouncedQuery, page, pageSize],

    queryFn: async ({
      signal,
    }): Promise<{
      articles: Article[];
      total: number;
    }> => {
      if (!debouncedQuery?.trim()) {
        return { articles: [], total: 0 };
      }

      const retstart = (page - 1) * pageSize;

      try {
        // STEP 1 — SEARCH
        const searchRes = await axios.get(
          "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi",
          {
            signal,
            params: {
              db: "pubmed",
              term: debouncedQuery,
              retmax: pageSize,
              retstart,
              retmode: "json",
            },
          },
        );

        const { idlist, count } = searchRes.data.esearchresult;
        const total = parseInt(count, 10) || 0;

        if (!idlist?.length) {
          return { articles: [], total };
        }

        // STEP 2 — FETCH DETAILS
        const fetchRes = await axios.get(
          "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi",
          {
            signal,
            params: {
              db: "pubmed",
              id: idlist.join(","),
              rettype: "abstract",
              retmode: "xml",
            },
          },
        );

        const parser = new DOMParser();
        const xml = parser.parseFromString(fetchRes.data, "text/xml");

        const articles: Article[] = Array.from(
          xml.querySelectorAll("PubmedArticle"),
        ).map((article) => {
          const safeText = (el: Element | null) =>
            el?.textContent?.trim() || "";

          const get = (selector: string) =>
            safeText(article.querySelector(selector));

          // ---------- ABSTRACT ----------
          const abstractNodes = article.querySelectorAll("AbstractText");

          let abstract = "No abstract available.";

          if (abstractNodes.length > 0) {
            abstract = Array.from(abstractNodes)
              .map((node) => {
                const label = node.getAttribute("Label");
                const text = node.textContent?.trim() || "";
                return label ? `${label}: ${text}` : text;
              })
              .join("\n\n");
          }

          // ---------- AUTHORS ----------
          const authorsList = Array.from(article.querySelectorAll("Author"))
            .map((a) => {
              const collective = safeText(a.querySelector("CollectiveName"));
              if (collective) return collective;

              const fore = safeText(a.querySelector("ForeName"));
              const last = safeText(a.querySelector("LastName"));

              const full = `${fore} ${last}`.trim();
              return full || null;
            })
            .filter(Boolean);

          const authors =
            authorsList.length > 0 ? authorsList.join(", ") : "Unknown";

          // ---------- PMC ----------
          const pmcidRaw = safeText(
            article.querySelector("ArticleId[IdType='pmc']"),
          );

          const pmcid = pmcidRaw
            ? pmcidRaw.replace(/pmc-id:\s*/i, "").replace(/;/g, "")
            : null;

          // ---------- YEAR ----------
          const year = get("PubDate Year") || get("PubDate MedlineDate") || "";

          const id = get("PMID");

          return {
            id,
            pmcid,
            title: get("ArticleTitle") || "No title",
            abstract,
            journal: get("Journal Title") || "Unknown Journal",
            year,
            authors,
            pdf: pmcid
              ? `https://www.ncbi.nlm.nih.gov/pmc/articles/${pmcid}/pdf`
              : null,
            pubmed: `https://pubmed.ncbi.nlm.nih.gov/${id}/`,
          };
        });

        return { articles, total };
      } catch (error: any) {
        if (axios.isCancel(error)) {
          return { articles: [], total: 0 };
        }

        throw new Error(
          error?.response?.data?.message ||
            error.message ||
            "Failed to fetch PubMed data",
        );
      }
    },

    enabled: !!debouncedQuery,
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });
}
