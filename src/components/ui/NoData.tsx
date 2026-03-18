import { FcMediumPriority } from "react-icons/fc";

const NoData = () => {
  return (
    <div className="w-full h-full flex flex-col justify-center items-center gap-10">
      <FcMediumPriority size={70} />
      No data available
    </div>
  );
};

export default NoData;
