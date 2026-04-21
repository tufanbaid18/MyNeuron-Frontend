import type { UploadFile } from "antd";
import { Input } from "antd";
import { HiPhoto } from "react-icons/hi2";
import { IMPULSE_CONSTANTS } from "../../../constants/impulse.constants";

interface ImageTabProps {
  content: string;
  fileList: UploadFile[];
  onContentChange: (content: string) => void;
  onPaste: (text: string) => void;
  onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveFile: (uid: string) => void;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
}

export const ImageTab = ({
  content,
  fileList,
  onContentChange,
  onPaste,
  // onFileSelect,
  onRemoveFile,
  fileInputRef,
}: ImageTabProps) => {
  return (
    <div className="flex flex-col gap-3">
      <Input.TextArea
        rows={3}
        placeholder="What do you want to talk about?"
        value={content}
        onChange={(e) => onContentChange(e.target.value)}
        onPaste={(e) => {
          const text = e.clipboardData.getData("text/plain");
          onPaste(text);
        }}
        className="resize-none"
      />
      <div className="flex gap-2 flex-wrap">
        {fileList.map((file) => (
          <div
            key={file.uid}
            className="relative w-20 h-20 bg-gray-50 rounded-lg overflow-hidden"
          >
            {file.originFileObj?.type.startsWith("video/") ? (
              <video
                src={file.url}
                className="w-full h-full object-cover rounded-lg border"
              />
            ) : (
              <img
                src={file.url}
                alt="preview"
                className="w-full h-full object-cover rounded-lg border"
              />
            )}
            <button
              type="button"
              onClick={() => onRemoveFile(file.uid)}
              className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center"
            >
              ×
            </button>
          </div>
        ))}
        {fileList.length < IMPULSE_CONSTANTS.MAX_IMAGES && (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="w-20 h-20 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center text-gray-400 hover:border-primary hover:text-primary transition-colors"
          >
            <HiPhoto className="w-8 h-8" />
          </button>
        )}
      </div>
    </div>
  );
};
