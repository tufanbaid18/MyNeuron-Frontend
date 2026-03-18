import { RiSearchEyeLine } from "react-icons/ri";

const StartSearch = () => {
  return (
    <div className="w-full h-full flex flex-col justify-center items-center gap-10">
      <RiSearchEyeLine size={70} />
      Start by entering a search query…
    </div>
  );
};

export default StartSearch;
