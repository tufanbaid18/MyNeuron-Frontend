import { BiLoader } from "react-icons/bi";

const Loading = ({className}:{className?: string}) => {
  return (
    <div className={`w-full h-full flex flex-col justify-center items-center gap-10 ${className}`}>
      <BiLoader className="animate-spin" size={70} />
      Loading...
    </div>
  );
};

export default Loading;
