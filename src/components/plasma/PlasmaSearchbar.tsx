import Input from "antd/es/input/Input";
import { IoSearch } from "react-icons/io5";

const PlasmaSearchBar = ({
  search,
  setSearch,
}: {
  search: string;
  setSearch: (search: string) => void;
}) => {
  return (
    <div className="w-[90%] sm:w-[80%] md:w-[70%] lg:w-[60%] xl:w-[50%] flex flex-col justify-center items-center gap-2">
      <Input
        style={{ borderRadius: "100px", padding: "8px 12px" }}
        prefix={<IoSearch size={18} className="shrink-0" />}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search Plasma..."
        className="w-full"
      />
    </div>
  );
};

export default PlasmaSearchBar;
