import { Input, Spin } from "antd";
import { AlertCircle, Video, Loader2 } from "lucide-react";
import type { UploadFile } from "antd";

interface VideoTabProps {
  content: string;
  fileList: UploadFile[];
  onContentChange: (content: string) => void;
  onVideoUrlChange: (url: string) => void;
  linkError?: string | null;
  isValidating?: boolean;
}

export const VideoTab = ({
  content,
  fileList,
  onContentChange,
  onVideoUrlChange,
  linkError = null,
  isValidating = false,
}: VideoTabProps) => {
  const videoUrl = fileList.length > 0 ? fileList[0].url || "" : "";

  return (
    <div className="flex flex-col gap-3">
      <Input.TextArea
        rows={3}
        placeholder="What do you want to talk about?"
        value={content}
        onChange={(e) => onContentChange(e.target.value)}
        className="resize-none"
      />

      <div className="flex flex-col gap-1">
        <Input
          placeholder="Paste video link (YouTube, Vimeo, etc.)"
          value={videoUrl}
          onChange={(e) => onVideoUrlChange(e.target.value)}
          status={linkError ? "error" : undefined}
          prefix={
            isValidating ? (
              <Spin
                indicator={
                  <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
                }
              />
            ) : (
              <Video className="w-4 h-4 text-gray-400" />
            )
          }
          suffix={
            linkError ? (
              <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
            ) : undefined
          }
        />

        {isValidating && (
          <p className="text-xs text-gray-400 flex items-center gap-1">
            <Loader2 className="w-3 h-3 animate-spin" />
            Validating link…
          </p>
        )}

        {linkError && !isValidating && (
          <p className="text-xs text-red-500 flex items-center gap-1">
            <AlertCircle className="w-3 h-3 shrink-0" />
            {linkError}
          </p>
        )}
      </div>

      {!linkError &&
        !isValidating &&
        fileList.length > 0 &&
        fileList[0]?.url && (
          <div className="mt-1 p-3 bg-gray-50 rounded-lg border">
            <p className="text-sm text-gray-500 mb-2">Video preview:</p>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Video className="w-5 h-5" />
              <span className="truncate">{fileList[0].url}</span>
            </div>
          </div>
        )}
    </div>
  );
};
