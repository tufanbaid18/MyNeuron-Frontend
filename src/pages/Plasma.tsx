import { useState } from "react";
import { IoSearch } from "react-icons/io5";

const Plasma = () => {
  const [search, setSearch] = useState<string>("");
  return (
    <div className="w-full h-full flex flex-col justify-center items-center bg-background">
      <div className="w-full py-5 flex flex-col justify-center items-center gap-5">
        <img src="/plasma.png" alt="plasma" />

        <div className="w-[80%] md:w-[70%] lg:w-[60%] xl:w-[50%] flex flex-col md:flex-row justify-center items-center gap-2">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search Plasma..."
            className="border border-gray-400 py-3 px-5 text-lg w-full rounded-full md:rounded-l-full md:rounded-r-none focus:outline-primary "
          />
          <button
            onClick={() => {}}
            className="flex text-lg items-center gap-2 border border-gray-400 bg-primary text-white px-5 py-3 rounded-full md:rounded-r-full md:rounded-l-none"
          >
            <IoSearch />
            Search
          </button>
        </div>
      </div>
      <div className="w-full h-full p-5">results</div>
    </div>
  );
};

export default Plasma;
