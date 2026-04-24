import { Input } from "antd";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";

interface ArticleTabProps {
  title: string;
  content: string;
  onTitleChange: (title: string) => void;
  onContentChange: (content: string) => void;
}

const QUILL_MODULES = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ["bold", "italic", "underline", "strike"],
    [{ list: "ordered" }, { list: "bullet" }],
    [{ align: [] }],
    ["blockquote", "code-block"],
    ["link", "image"],
    ["clean"],
  ],
};

const QUILL_FORMATS = [
  "header",
  "bold",
  "italic",
  "underline",
  "strike",
  "list",
  "align",
  "blockquote",
  "code-block",
  "link",
  "image",
];

export const ArticleTab = ({
  title,
  content,
  onTitleChange,
  onContentChange,
}: ArticleTabProps) => {
  return (
    <div className="flex flex-col gap-3 article-editor-wrapper">
      <Input
        placeholder="Title"
        value={title}
        onChange={(e) => onTitleChange(e.target.value)}
        className="font-semibold"
      />
      <ReactQuill
        theme="snow"
        value={content}
        onChange={onContentChange}
        modules={QUILL_MODULES}
        formats={QUILL_FORMATS}
        placeholder="Write your article..."
        style={{ minHeight: 200 }}
      />
    </div>
  );
};
