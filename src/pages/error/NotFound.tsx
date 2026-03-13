import { useNavigate } from "@tanstack/react-router";
import { Button, Result } from "antd";
import { APP_ROUTES } from "../../constants/app.routes";

const NotFound = () => {
  const navigate = useNavigate();
  return (
    <div className="w-full h-full flex justify-center items-center">
      <Result
        status="404"
        title="404"
        subTitle="Sorry, the page you visited does not exist."
        extra={
          <Button
            className="bg-primary"
            onClick={() => navigate({ to: APP_ROUTES.PLASMA })}
          >
            Back Home
          </Button>
        }
      />
    </div>
  );
};

export default NotFound;
