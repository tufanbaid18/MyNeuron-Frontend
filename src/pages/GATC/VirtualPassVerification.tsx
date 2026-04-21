import React, { useEffect } from "react";
import { Avatar, Card, Result, Spin, Tag, Typography } from "antd";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { gatcVirtualPassRoute } from "../../routes/public.routes";
import { useVerifyVirtualPass } from "../../hooks/gatc/useGatcPayment";
import { getAvatarByName } from "../../utils/avatar.utils";

const { Title, Text } = Typography;

const VirtualPassVerification: React.FC = () => {
  const { user_id, event_id } = gatcVirtualPassRoute.useSearch();
  const { mutate, data, isPending, isError, error } = useVerifyVirtualPass();

  useEffect(() => {
    if (user_id && event_id) {
      mutate({
        userId: Number(user_id),
        eventId: Number(event_id),
      });
    }
  }, [user_id, event_id, mutate]);

  if (!user_id || !event_id) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Result
          status="warning"
          title="Invalid Pass Data"
          subTitle="The QR code appears to be invalid or is missing required parameters."
        />
      </div>
    );
  }

  if (isPending) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <Spin size="large" />
        <h3 className="mt-4 text-gray-500 font-medium">
          Verifying Virtual Pass...
        </h3>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Result
          status="error"
          title="Verification Failed"
          subTitle={error?.message || "Failed to verify the virtual pass."}
        />
      </div>
    );
  }

  if (data) {
    const isVerified =
      data.payment.status === "PAID" ||
      data.payment.status === "MANUAL_VERIFIED" ||
      data.payment.manual_payment_status === "VERIFIED";

    return (
      <div className="min-h-dvh bg-gray-50 flex items-center justify-center p-4">
        <Card
          className="w-full max-w-md shadow-xl rounded-3xl border-0 overflow-hidden"
          styles={{ body: { padding: 0 } }}
        >
          {/* Header Banner */}
          <div
            className={`px-6 py-8 text-center text-white ${
              isVerified
                ? "bg-linear-to-br from-green-500 to-emerald-600"
                : "bg-linear-to-br from-red-500 to-rose-600"
            }`}
          >
            {isVerified ? (
              <CheckCircleOutlined className="text-6xl mb-4 opacity-90" />
            ) : (
              <CloseCircleOutlined className="text-6xl mb-4 opacity-90" />
            )}
            <h2 className="text-2xl font-bold m-0 text-white">
              {isVerified ? "Pass Verified" : "Verification Failed"}
            </h2>
            <p className="opacity-80 mt-1 mb-0 font-medium">
              {isVerified
                ? "Attendee is actively registered"
                : "Payment not verified or pending"}
            </p>
          </div>

          {/* Profile Section */}
          <div className="px-6 py-8 flex flex-col items-center -mt-10 relative">
            <Avatar
              size={80}
              src={
                data.user.profile_image ??
                getAvatarByName({
                  firstName: data.user.name.split(" ")[0],
                  lastName:
                    data.user.name.split(" ").slice(1).join(" ") || undefined,
                })
              }
              icon={<UserOutlined />}
              className="border-4 border-white shadow-md bg-white text-gray-400 mb-4"
            />
            <Title level={4} className="m-0! text-center text-gray-800">
              {data.user.name}
            </Title>
            {data.user.profile_title && (
              <Text className="text-gray-500 font-medium mt-1 text-center">
                {data.user.profile_title}
              </Text>
            )}
            <Text className="text-gray-400 mt-0.5 text-center text-sm">
              {data.user.email}
            </Text>
          </div>

          <div className="px-6 pb-8 space-y-4">
            <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100 flex justify-between items-center">
              <div>
                <Text className="text-gray-500 block text-xs uppercase tracking-wider font-semibold mb-1">
                  Event
                </Text>
                <Text className="text-gray-800 font-bold block">
                  {data.event.event_name}
                </Text>
              </div>
              <Tag
                color="purple"
                className="m-0 rounded-full px-3 py-1 font-semibold border-0"
              >
                {data.event.category}
              </Tag>
            </div>

            <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100 space-y-3">
              <div className="flex justify-between items-center">
                <Text className="text-gray-500 text-sm font-medium">
                  Payment Status
                </Text>
                <Tag
                  color={isVerified ? "success" : "error"}
                  className="m-0 font-bold uppercase rounded-md border-0"
                >
                  {data.payment.status}
                </Tag>
              </div>

              {data.payment.manual_payment_status && (
                <div className="flex justify-between items-center">
                  <Text className="text-gray-500 text-sm font-medium">
                    Manual Verification
                  </Text>
                  <Text className="font-semibold text-gray-700">
                    {data.payment.manual_payment_status}
                  </Text>
                </div>
              )}
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return null;
};

export default VirtualPassVerification;
