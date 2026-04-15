import React, { useState } from "react";
import { Modal, Form, Input, Button, message, theme } from "antd";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  addFileLinkSchema,
  type AddFileLinkForm,
} from "../../validations/bookshelf/bookshelf.schemas";
import { createFolderItem } from "../../services/bookshelf/bookshelf.service";

const { useToken } = theme;

type AddFileLinkModalProps = {
  open: boolean;
  onClose: () => void;
  folderId: number;
  onSuccess: () => void;
};

const AddFileLinkModal: React.FC<AddFileLinkModalProps> = ({
  open,
  onClose,
  folderId,
  onSuccess,
}) => {
  const { token } = useToken();
  const [loading, setLoading] = useState(false);
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AddFileLinkForm>({
    resolver: zodResolver(addFileLinkSchema),
    defaultValues: { folder: folderId, title: "", url: "" },
  });

  React.useEffect(() => {
    reset({ folder: folderId, title: "", url: "" });
  }, [folderId, reset, open]);

  const onSubmit = async (data: AddFileLinkForm) => {
    setLoading(true);
    try {
      await createFolderItem(data);
      message.success("File added successfully");
      reset();
      onSuccess();
      onClose();
    } catch (error: any) {
      console.error(error);
      message.error(error.response?.data?.detail || "Failed to add file");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Add New File"
      open={open}
      onCancel={() => {
        reset();
        onClose();
      }}
      footer={null}
      destroyOnHidden
    >
      <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
        {/* Ant Design Alert or help text could be here for the complex validation rule */}
        <p
          style={{
            color: token.colorTextSecondary,
            marginBottom: 24,
            fontSize: 14,
          }}
        >
          Provide the Name of the file, its URL, or both.
        </p>

        <Form.Item
          label={<span style={{ fontWeight: 500 }}>Name (Optional)</span>}
          validateStatus={errors.title ? "error" : ""}
          help={errors.title?.message}
        >
          <Controller
            name="title"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                placeholder="Enter file name"
                autoFocus
                size="large"
              />
            )}
          />
        </Form.Item>

        <Form.Item
          label={
            <span style={{ fontWeight: 500 }}>File URL / Action Link</span>
          }
          validateStatus={errors.url ? "error" : ""}
          help={errors.url?.message}
          required
        >
          <Controller
            name="url"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                placeholder="https://example.com/file.pdf"
                size="large"
              />
            )}
          />
        </Form.Item>

        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: 12,
            marginTop: 32,
          }}
        >
          <Button
            onClick={onClose}
            disabled={loading}
            size="large"
            style={{ borderRadius: 6 }}
          >
            Cancel
          </Button>
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            size="large"
            style={{ borderRadius: 6, fontWeight: 500 }}
          >
            Add File
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default AddFileLinkModal;
