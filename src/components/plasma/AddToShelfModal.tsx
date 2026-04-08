/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import { Modal, Form, Input, Button, message, TreeSelect } from "antd";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  addFileLinkSchema,
  type AddFileLinkForm,
} from "../../validations/bookshelf/bookshelf.schemas";
import {
  createFolderItem,
  getFoldersTree,
} from "../../services/bookshelf/bookshelf.service";
import type { BookshelfFolder } from "../../types/bookshelf.types";

export type SelectedArticleContext = {
  title: string;
  url: string;
};

type AddToShelfModalProps = {
  open: boolean;
  onClose: () => void;
  article: SelectedArticleContext | null;
};

const AddToShelfModal: React.FC<AddToShelfModalProps> = ({
  open,
  onClose,
  article,
}) => {
  const [loading, setLoading] = useState(false);
  const [treeData, setTreeData] = useState<BookshelfFolder[]>([]);
  const [fetchingFolders, setFetchingFolders] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AddFileLinkForm>({
    resolver: zodResolver(addFileLinkSchema),
    defaultValues: { folder: undefined as any, title: "", url: "" },
  });

  useEffect(() => {
    if (open) {
      if (article) {
        reset({
          folder: undefined as any,
          title: article.title,
          url: article.url,
        });
      }
      fetchFolders();
    }
  }, [open, article, reset]);

  const fetchFolders = async () => {
    try {
      setFetchingFolders(true);
      const data = await getFoldersTree();
      setTreeData(data);
    } catch (error) {
      console.error("Failed to fetch bookshelf tree", error);
      message.error("Could not load Bookshelf folders.");
    } finally {
      setFetchingFolders(false);
    }
  };

  const onSubmit = async (data: AddFileLinkForm) => {
    setLoading(true);
    try {
      await createFolderItem(data);
      message.success(`"${data.title || "Article"}" saved to your Bookshelf`);
      reset();
      onClose();
    } catch (error: any) {
      console.error(error);
      message.error(error.response?.data?.detail || "Failed to add file");
    } finally {
      setLoading(false);
    }
  };

  // Convert API BookshelfFolder[] to Ant Design TreeSelect compatible DataNode[]
  const formatTreeData = (folders: BookshelfFolder[]): any[] => {
    return folders.map((folder) => ({
      title: folder.name,
      value: folder.id,
      children: folder.subfolders?.length
        ? formatTreeData(folder.subfolders)
        : [],
    }));
  };

  return (
    <Modal
      title="Add to My Bookshelf"
      open={open}
      onCancel={() => {
        reset();
        onClose();
      }}
      footer={null}
      destroyOnHidden
    >
      <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
        <p className="mb-6 text-sm text-gray-500">
          Save this article to an existing folder in your Bookshelf.
        </p>

        <Form.Item
          label={<span className="font-medium">Destination Folder</span>}
          validateStatus={errors.folder ? "error" : ""}
          help={errors.folder ? "Please select a destination folder." : ""}
          required
        >
          <Controller
            name="folder"
            control={control}
            render={({ field }) => (
              <TreeSelect
                {...field}
                treeData={formatTreeData(treeData)}
                placeholder="Select a folder"
                treeDefaultExpandAll
                size="large"
                loading={fetchingFolders}
                allowClear
                dropdownStyle={{ maxHeight: 400, overflow: "auto" }}
              />
            )}
          />
        </Form.Item>

        <Form.Item
          label={<span className="font-medium">Name</span>}
          validateStatus={errors.title ? "error" : ""}
          help={errors.title?.message}
        >
          <Controller
            name="title"
            control={control}
            render={({ field }) => (
              <Input {...field} placeholder="Enter file name" size="large" />
            )}
          />
        </Form.Item>

        <Form.Item
          label={<span className="font-medium">Source URL</span>}
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

        <div className="mt-8 flex justify-end gap-3">
          <Button
            onClick={onClose}
            disabled={loading}
            size="large"
            className="rounded-md"
          >
            Cancel
          </Button>
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            size="large"
            className="rounded-md font-medium"
            disabled={treeData.length === 0}
          >
            Add to Shelf
          </Button>
        </div>

        {treeData.length === 0 && !fetchingFolders && (
          <p className="mt-4 text-xs text-red-500 text-right">
            No folders exist! Please create a folder in My Bookshelf first.
          </p>
        )}
      </Form>
    </Modal>
  );
};

export default AddToShelfModal;
