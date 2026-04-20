import React, { useState } from "react";
import { Modal, Form, Input, Button, message } from "antd";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createFolderSchema,
  type CreateFolderForm,
} from "../../validations/bookshelf/bookshelf.schemas";
import { createFolder } from "../../services/bookshelf/bookshelf.service";

type CreateFolderModalProps = {
  open: boolean;
  onClose: () => void;
  parentId: number | null;
  onSuccess: () => void;
};

const CreateFolderModal: React.FC<CreateFolderModalProps> = ({
  open,
  onClose,
  parentId,
  onSuccess,
}) => {
  const [loading, setLoading] = useState(false);
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateFolderForm>({
    resolver: zodResolver(createFolderSchema),
    defaultValues: { name: "", parent: parentId },
  });

  // Keep parent id updated if it changes while modal is open (rare)
  React.useEffect(() => {
    reset({ name: "", parent: parentId });
  }, [parentId, reset, open]);

  const onSubmit = async (data: CreateFolderForm) => {
    setLoading(true);
    try {
      await createFolder({ ...data, parent: parentId });
      message.success("Folder created successfully");
      reset();
      onSuccess();
      onClose();
    } catch (error: unknown) {
      console.error(error);
      const axiosErr = error as { response?: { data?: { detail?: string } } };
      message.error(axiosErr.response?.data?.detail || "Failed to create folder");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Create New Folder"
      open={open}
      onCancel={() => {
        reset();
        onClose();
      }}
      footer={null}
      destroyOnHidden
    >
      <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
        <Form.Item
          label="Folder Name"
          validateStatus={errors.name ? "error" : ""}
          help={errors.name?.message}
        >
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <Input {...field} placeholder="Enter folder name" autoFocus />
            )}
          />
        </Form.Item>
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
          <Button onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button type="primary" htmlType="submit" loading={loading}>
            Create
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default CreateFolderModal;
