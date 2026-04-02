import { Avatar, Button, Modal, QRCode } from "antd";
import React, { useMemo } from "react";
import { APP_ROUTES } from "../../../constants/app.routes";
import { env } from "../../../constants/env";
import { useUserProfile } from "../../../hooks/auth/useUserProfile";
import { RegisteredEventPaymentStatus } from "../../../types/user/user.types";
import { getAvatarByName } from "../../../utils/avatar.utils";

const GatcVirtualPass: React.FC = () => {
  const [open, setOpen] = React.useState<boolean>(false);

  const { data: user, isLoading, isFetching } = useUserProfile();

  const link = useMemo(() => {
    if (user) {
      if (
        user.registered_events.some(
          (event) =>
            event.payment_status === RegisteredEventPaymentStatus.PAID ||
            event.payment_status ===
              RegisteredEventPaymentStatus.MANUAL_VERIFIED,
        )
      ) {
        return `${env.VITE_APP_FRONTEND_URL}/${APP_ROUTES.GATC_VIRTUAL_PASS}?user_id=${user.id}&event_id=${env.VITE_DEFAULT_GATC_EVENT_ID}`;
      } else {
        return "";
      }
    }
    return "";
  }, [user]);

  function doDownload(url: string, fileName: string) {
    const a = document.createElement("a");
    a.download = fileName;
    a.href = url;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  const downloadFullPass = () => {
    const node = document.getElementById("virtual-pass-card");
    if (node) {
      import("html-to-image").then((htmlToImage) => {
        htmlToImage
          .toPng(node, {
            backgroundColor: "#ffffff",
            quality: 1,
            pixelRatio: 2, // High resolution
            imagePlaceholder:
              "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=",
            fetchRequestInit: { cache: "no-cache" },
            filter: (domNode) => {
              return domNode?.id !== "pass-avatar";
            },
          })
          .then((dataUrl) => {
            doDownload(dataUrl, "GATC-Virtual-Pass.png");
          })
          .catch((error) => {
            console.error("Oops, something went wrong!", error);
          });
      });
    }
  };
  const fullname = (user?.first_name ?? "User") + " " + (user?.last_name ?? "");
  const registrationType = user?.registered_events.find(
    (event) => event.event_id === Number(env.VITE_DEFAULT_GATC_EVENT_ID),
  )?.category;

  return (
    <>
      <Button type="primary" onClick={() => setOpen(true)}>
        View Virtual Pass
      </Button>
      <Modal
        loading={isLoading || isFetching}
        open={open}
        footer={null}
        closable={false}
        onCancel={() => setOpen(false)}
        centered
        width={400}
        styles={{ body: { padding: "16px" } }}
      >
        {link ? (
          <div className="flex flex-col gap-4">
            <div
              id="virtual-pass-card"
              className="bg-white p-6 rounded-3xl flex flex-col gap-6"
            >
              <div className="text-center space-y-1">
                <h3 className="text-xl font-extrabold text-gray-800 m-0 leading-tight">
                  GATC 2026
                </h3>
                <p className="text-sm font-medium text-gray-500 m-0 uppercase tracking-widest">
                  Virtual Pass
                </p>
              </div>

              <div className="flex justify-center items-center">
                <div className="bg-white p-2 rounded-2xl border-2 border-gray-100 shadow-sm">
                  <QRCode
                    size={280}
                    style={{ height: "auto", maxWidth: "100%" }}
                    value={link}
                    type="canvas"
                    bgColor="#ffffff"
                  />
                </div>
              </div>

              <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-xl border border-gray-100 mt-2">
                <div id="pass-avatar">
                  <Avatar
                    size={56}
                    src={
                      user?.profile_image ??
                      getAvatarByName({
                        firstName: user?.first_name,
                        lastName: user?.last_name,
                      })
                    }
                    className="border border-gray-300 shrink-0 bg-white"
                  />
                </div>
                <div className="flex flex-col flex-1 overflow-hidden">
                  <span
                    className="text-lg font-bold text-gray-800 truncate"
                    title={fullname}
                  >
                    {fullname}
                  </span>
                  <span
                    className="text-sm text-gray-500 font-medium truncate"
                    title={registrationType || "Attendee"}
                  >
                    {registrationType || "Attendee"}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                size="large"
                onClick={() => setOpen(false)}
                className="flex-1 rounded-xl font-medium border-gray-200"
              >
                Close
              </Button>
              <Button
                size="large"
                type="primary"
                className="flex-1 rounded-xl font-medium shadow-md"
                onClick={downloadFullPass}
              >
                Download Pass
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center py-10">
            <p className="text-gray-500 text-lg">
              You are not registered for this event.
            </p>
            <Button className="mt-4" onClick={() => setOpen(false)}>
              Close
            </Button>
          </div>
        )}
      </Modal>
    </>
  );
};

export default GatcVirtualPass;
