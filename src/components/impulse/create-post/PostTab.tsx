import { Input } from "antd";

interface PostTabProps {
  content: string;
  onChange: (content: string) => void;
  onPaste: (text: string) => void;
}

export const PostTab = ({ content, onChange, onPaste }: PostTabProps) => {
  return (
    <div className="flex flex-col gap-3">
      <Input.TextArea
        rows={4}
        placeholder="What do you want to talk about?"
        value={content}
        onChange={(e) => onChange(e.target.value)}
        onPaste={(e) => {
          const text = e.clipboardData.getData("text/plain");
          onPaste(text);
        }}
        className="resize-none"
      />
    </div>
  );
};
