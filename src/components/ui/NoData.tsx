import { FcMediumPriority } from "react-icons/fc";

const NoData = ({ title }: { title?: string }) => {
  return (
    <div className="w-full h-full flex flex-col justify-center items-center gap-10">
      <FcMediumPriority size={70} />
      {title ? title : "No data available"}
    </div>
  );
};

export default NoData;
