import ErrorIcon from "../icons/ErrorIcon";

const ErrorComponent = () => {
  return (
    <div className="w-full h-full flex flex-col justify-center items-center gap-10">
      <ErrorIcon size={70} />
      Error fetching data
    </div>
  );
};

export default ErrorComponent;
