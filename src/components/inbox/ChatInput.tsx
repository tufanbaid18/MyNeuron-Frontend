import { SendOutlined } from "@ant-design/icons";
import { Button, Input } from "antd";
import { useState } from "react";

interface ChatInputProps {
  onSend: (content: string) => void;
  isPending?: boolean;
}

export const ChatInput = ({ onSend, isPending }: ChatInputProps) => {
  const [text, setText] = useState("");

  const handleSend = () => {
    if (!text.trim()) return;
    onSend(text);
    setText("");
  };

  return (
    <div className="flex items-center gap-3 border-t border-slate-200 bg-white px-5 py-3">
      <Input
        placeholder="Type a message..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        onPressEnter={handleSend}
        className="rounded-full"
        size="large"
      />
      <Button
        type="primary"
        icon={<SendOutlined />}
        onClick={handleSend}
        loading={isPending}
        disabled={!text.trim()}
        shape="circle"
        size="large"
        className="bg-emerald-600 hover:bg-emerald-500"
      />
    </div>
  );
};
