import { FcMediumPriority } from "react-icons/fc";

const NoData = ({
  title,
  icon,
}: {
  title?: string;
  icon?: React.ReactNode;
}) => {
  return (
    <div className="w-full h-full flex flex-col justify-center items-center gap-10">
      {icon ? icon : <FcMediumPriority size={70} />}
      {title ? title : "No data available"}
    </div>
  );
};

export default NoData;
