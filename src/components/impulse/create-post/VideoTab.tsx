import { Input } from "antd";
import type { UploadFile } from "antd";
import { Video } from "lucide-react";

interface VideoTabProps {
  content: string;
  fileList: UploadFile[];
  onContentChange: (content: string) => void;
  onVideoUrlChange: (url: string) => void;
}

export const VideoTab = ({ content, fileList, onContentChange, onVideoUrlChange }: VideoTabProps) => {
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
      <Input
        placeholder="Paste video link (YouTube, Vimeo, etc.)"
        value={videoUrl}
        onChange={(e) => onVideoUrlChange(e.target.value)}
        prefix={<Video className="w-4 h-4 text-gray-400" />}
      />
      {fileList.length > 0 && fileList[0]?.url && (
        <div className="mt-2 p-3 bg-gray-50 rounded-lg border">
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
