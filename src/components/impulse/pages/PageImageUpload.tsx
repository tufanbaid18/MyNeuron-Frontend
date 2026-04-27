import { CameraOutlined, DeleteOutlined } from "@ant-design/icons";
import { Avatar, message, theme, Tooltip, Upload } from "antd";
import { useMemo, useState } from "react";
import { PAGE_IMAGE_CONSTANTS } from "../../../validations/page.schemas";

const { useToken } = theme;

interface PageImageUploadProps {
  onCoverChange: (file: File | undefined) => void;
  onProfileChange: (file: File | undefined) => void;
  initialCoverUrl?: string;
  initialProfileUrl?: string;
}

const COVER_HEIGHT = 160;
const PROFILE_SIZE = 88;

const PageImageUpload = ({
  onCoverChange,
  onProfileChange,
  initialCoverUrl,
  initialProfileUrl,
}: PageImageUploadProps) => {
  const { token } = useToken();
  const [coverPreview, setCoverPreview] = useState<string | null>(
    initialCoverUrl ?? null,
  );
  const [profilePreview, setProfilePreview] = useState<string | null>(
    initialProfileUrl ?? null,
  );

  const MAX_FILE_SIZE_MB = 5;
const MAX_FILENAME_LENGTH = 90;

const truncateFilename = (name: string): string => {
  if (name.length <= MAX_FILENAME_LENGTH) return name;
  const ext = name.split(".").pop() ?? "";
  const baseName = name.slice(0, name.length - ext.length - 1);
  const availableLength = MAX_FILENAME_LENGTH - ext.length - 1;
  return `${baseName.slice(0, Math.max(availableLength, 1))}.${ext}`;
};

const validateFile = (file: File): boolean => {
  if (!PAGE_IMAGE_CONSTANTS.ALLOWED_TYPES.some((t) => t === file.type)) {
    message.error(`Only ${PAGE_IMAGE_CONSTANTS.ALLOWED_LABEL} allowed`);
    return false;
  }
  if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
    message.error(`"${truncateFilename(file.name)}" exceeds 5MB limit`);
    return false;
  }
  return true;
};

  const placeholderGradient = useMemo(
    () =>
      `linear-gradient(135deg, ${token.colorPrimaryBg} 0%, ${token.colorPrimary}22 50%, ${token.colorPrimaryBgHover} 100%)`,
    [token],
  );

  return (
    <div
      style={{
        position: "relative",
        marginBottom: PROFILE_SIZE / 2 + 12,
        borderRadius: 12,
        overflow: "visible",
      }}
    >
      {/* ── Cover Image ──────────────────────────────────── */}
      <Upload
        style={{
          width: "100%",
        }}
        showUploadList={false}
        accept={PAGE_IMAGE_CONSTANTS.ALLOWED_TYPES.join(",")}
        beforeUpload={(file) => {
          if (!validateFile(file)) return Upload.LIST_IGNORE;
          const url = URL.createObjectURL(file);
          setCoverPreview(url);
          onCoverChange(file);
          return false;
        }}
      >
        <Tooltip title="Upload cover image" placement="bottom">
          <div
            style={{
              width: "100%",
              height: COVER_HEIGHT,
              borderRadius: 12,
              background: coverPreview
                ? `url(${coverPreview}) center / cover no-repeat`
                : placeholderGradient,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.3s ease",
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* Hover overlay */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: "rgba(0,0,0,0.25)",
                opacity: 0,
                transition: "opacity 0.25s ease",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 12,
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.opacity = "1";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.opacity = "0";
              }}
            >
              <CameraOutlined
                style={{ fontSize: 28, color: "#fff", marginRight: 8 }}
              />
              <span style={{ color: "#fff", fontWeight: 500, fontSize: 14 }}>
                {coverPreview ? "Change Cover" : "Add Cover Photo"}
              </span>
            </div>

            {!coverPreview && (
              <div style={{ textAlign: "center", pointerEvents: "none" }}>
                <CameraOutlined
                  style={{
                    fontSize: 28,
                    color: token.colorPrimary,
                    opacity: 0.6,
                  }}
                />
                <div
                  style={{
                    color: token.colorTextSecondary,
                    fontSize: 13,
                    marginTop: 4,
                  }}
                >
                  Add a cover photo
                </div>
              </div>
            )}
          </div>
        </Tooltip>
      </Upload>

      {/* Cover remove button */}
      {coverPreview && (
        <Tooltip title="Remove cover">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setCoverPreview(null);
              onCoverChange(undefined);
            }}
            style={{
              position: "absolute",
              top: 8,
              right: 8,
              width: 28,
              height: 28,
              borderRadius: "50%",
              border: "none",
              background: "rgba(0,0,0,0.5)",
              color: "#fff",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 2,
              transition: "background 0.2s",
            }}
          >
            <DeleteOutlined style={{ fontSize: 13 }} />
          </button>
        </Tooltip>
      )}

      {/* ── Profile Image ────────────────────────────────── */}
      <div
        style={{
          position: "absolute",
          bottom: -(PROFILE_SIZE / 2),
          left: 20,
          zIndex: 3,
        }}
      >
        <Upload
          showUploadList={false}
          accept={PAGE_IMAGE_CONSTANTS.ALLOWED_TYPES.join(",")}
          beforeUpload={(file) => {
            if (!validateFile(file)) return Upload.LIST_IGNORE;
            const url = URL.createObjectURL(file);
            setProfilePreview(url);
            onProfileChange(file);
            return false;
          }}
        >
          <Tooltip title="Upload profile image" placement="bottom">
            <div
              style={{
                position: "relative",
                cursor: "pointer",
                borderRadius: "50%",
              }}
            >
              <Avatar
                size={PROFILE_SIZE}
                src={profilePreview}
                style={{
                  border: `3.5px solid ${token.colorBgContainer}`,
                  boxShadow: `0 2px 12px ${token.colorBorderSecondary}`,
                  background: profilePreview ? undefined : token.colorPrimaryBg,
                  color: token.colorPrimary,
                  fontSize: 32,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {!profilePreview && <CameraOutlined style={{ fontSize: 28 }} />}
              </Avatar>

              {/* Small camera badge */}
              <div
                style={{
                  position: "absolute",
                  bottom: 2,
                  right: 2,
                  width: 26,
                  height: 26,
                  borderRadius: "50%",
                  background: token.colorPrimary,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border: `2px solid ${token.colorBgContainer}`,
                }}
              >
                <CameraOutlined style={{ fontSize: 12, color: "#fff" }} />
              </div>
            </div>
          </Tooltip>
        </Upload>

        {/* Profile remove */}
        {profilePreview && (
          <Tooltip title="Remove profile photo">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setProfilePreview(null);
                onProfileChange(undefined);
              }}
              style={{
                position: "absolute",
                top: -4,
                right: -4,
                width: 22,
                height: 22,
                borderRadius: "50%",
                border: "none",
                background: "rgba(0,0,0,0.55)",
                color: "#fff",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 4,
              }}
            >
              <DeleteOutlined style={{ fontSize: 10 }} />
            </button>
          </Tooltip>
        )}
      </div>
    </div>
  );
};

export default PageImageUpload;
