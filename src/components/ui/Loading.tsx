import { Skeleton } from "antd";

const Loading = ({ className }: { className?: string }) => {
  return (
    <div className={`w-full h-full flex flex-col justify-center items-center gap-5 ${className}`}>
      <div className="w-[90%] flex justify-start items-start gap-5 p-5 rounded-md shadow-md border border-gray-100">
        <Skeleton.Avatar active size={40} shape="square" />
        <div className="flex flex-col items-start justify-start gap-3 w-full">
          <Skeleton.Input active size="small" style={{ width: "60%" }} />
          <Skeleton.Input active size="small" style={{ width: "40%" }} />
          <Skeleton.Input active size="small" style={{ width: "30%" }} />
          <Skeleton.Input active size="small" style={{ width: "80%" }} />
          <Skeleton.Input active size="small" style={{ width: "50%" }} />
        </div>
      </div>
      <div className="w-[90%] flex justify-start items-start gap-5 p-5 rounded-md shadow-md border border-gray-100">
        <Skeleton.Avatar active size={40} shape="square" />
        <div className="flex flex-col items-start justify-start gap-3 w-full">
          <Skeleton.Input active size="small" style={{ width: "55%" }} />
          <Skeleton.Input active size="small" style={{ width: "35%" }} />
          <Skeleton.Input active size="small" style={{ width: "25%" }} />
          <Skeleton.Input active size="small" style={{ width: "75%" }} />
          <Skeleton.Input active size="small" style={{ width: "45%" }} />
        </div>
      </div>
      <div className="w-[90%] flex justify-start items-start gap-5 p-5 rounded-md shadow-md border border-gray-100">
        <Skeleton.Avatar active size={40} shape="square" />
        <div className="flex flex-col items-start justify-start gap-3 w-full">
          <Skeleton.Input active size="small" style={{ width: "65%" }} />
          <Skeleton.Input active size="small" style={{ width: "45%" }} />
          <Skeleton.Input active size="small" style={{ width: "30%" }} />
          <Skeleton.Input active size="small" style={{ width: "70%" }} />
          <Skeleton.Input active size="small" style={{ width: "40%" }} />
        </div>
      </div>
    </div>
  );
};

export default Loading;
