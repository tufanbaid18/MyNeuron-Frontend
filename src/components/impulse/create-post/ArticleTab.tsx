import { Input } from "antd";
import { Editor } from "@tinymce/tinymce-react";

interface ArticleTabProps {
  title: string;
  content: string;
  onTitleChange: (title: string) => void;
  onContentChange: (content: string) => void;
}

export const ArticleTab = ({
  title,
  content,
  onTitleChange,
  onContentChange,
}: ArticleTabProps) => {
  return (
    <div className="flex flex-col gap-3">
      <Input
        placeholder="Title"
        value={title}
        onChange={(e) => onTitleChange(e.target.value)}
        className="font-semibold"
      />
      <Editor
        apiKey="gzbaq6k6otgk5w4c2vhnm06gksbkpyt5ahllriq2s49rj3ty"
        value={content}
        onEditorChange={onContentChange}
        init={{
          height: 200,
          menubar: false,
          plugins:
            "advlist autolink lists link image charmap preview anchor searchreplace visualblocks code fullscreen insertdatetime media table help wordcount",
          toolbar:
            "undo redo | formatselect | bold italic underline | alignleft aligncenter alignright | bullist numlist | link image media table | code preview fullscreen",
        }}
      />
    </div>
  );
};
