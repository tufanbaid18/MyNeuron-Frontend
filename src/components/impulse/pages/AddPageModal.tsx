import { useQueryClient } from "@tanstack/react-query";
import { Button, Divider, Form, Input, Modal, theme, Typography } from "antd";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useCreatePage } from "../../../hooks/impulse/useCreatePage";
import { useUpdatePage } from "../../../hooks/impulse/usePages";
import type {
  CreatePagePayload,
  PageDetails,
} from "../../../types/impulse/page.types";
import { PageCategory } from "../../../types/impulse/page.types";
import {
  createPageDefaultValues,
  createPageSchema,
} from "../../../validations/page.schemas";
import { createZodValidator } from "../../../validations/zodValidator";
import CategorySelector from "./CategorySelector";
import CommunityFields from "./CommunityFields";
import CompanyFields from "./CompanyFields";
import EventFields from "./EventFields";
import LocationFields from "./LocationFields";
import PageImageUpload from "./PageImageUpload";

const { Text } = Typography;
const { useToken } = theme;

interface AddPageModalProps {
  open: boolean;
  onCancel: () => void;
  /** When provided, the modal operates in "edit" mode */
  pageDetails?: PageDetails;
}

const validator = (field: keyof typeof createPageSchema.shape) =>
  createZodValidator(createPageSchema, field, "registration");

const AddPageModal = ({ open, onCancel, pageDetails }: AddPageModalProps) => {
  const [form] = Form.useForm();
  const { token } = useToken();
  const queryClient = useQueryClient();
  const selectedCategory = Form.useWatch("category", form);

  const isEditMode = !!pageDetails;

  // Image state lives outside the form since Ant Design Forms don't handle File objects natively
  const coverImageRef = useRef<File | undefined>(undefined);
  const profileImageRef = useRef<File | undefined>(undefined);
  const [hasImages, setHasImages] = useState(() => ({
    cover: !!pageDetails?.cover_image,
    profile: !!pageDetails?.profile_image,
  }));

  const { mutate: createPage, isPending: isCreating } = useCreatePage({
    onSuccess: () => {
      toast.success("Page created successfully!");
      queryClient.invalidateQueries({ queryKey: ["pages-overview"] });
      handleClose();
    },
    onError: () => {
      toast.error("Failed to create page. Please try again.");
    },
  });

  const { mutate: updatePageMutate, isPending: isUpdating } = useUpdatePage();

  const isPending = isCreating || isUpdating;

  // Pre-fill form when editing
  useEffect(() => {
    if (open && pageDetails) {
      form.setFieldsValue({
        page_name: pageDetails.page_name,
        category: pageDetails.category,
        bio: pageDetails.bio,
        website: pageDetails.website || "",
        state: pageDetails.state || "",
        zip: pageDetails.zip || "",
        country: pageDetails.country || "",
        company_name: pageDetails.company_name || "",
        official_website: pageDetails.official_website || "",
        company_bio: pageDetails.company_bio || "",
        cin: pageDetails.cin || "",
        event_name: pageDetails.event_name || "",
        event_description: pageDetails.event_description || "",
        tags: pageDetails.tags ? pageDetails.tags.split(",") : [],
        community_details: pageDetails.community_details || "",
      });
    }
  }, [open, pageDetails, form]);

  const handleClose = useCallback(() => {
    form.resetFields();
    coverImageRef.current = undefined;
    profileImageRef.current = undefined;
    setHasImages({ cover: false, profile: false });
    onCancel();
  }, [form, onCancel]);

  const handleSubmit = useCallback(
    (values: Omit<CreatePagePayload, "cover_image" | "profile_image">) => {
      const payload: CreatePagePayload = {
        ...values,
        cover_image: coverImageRef.current,
        profile_image: profileImageRef.current,
      };

      if (isEditMode) {
        updatePageMutate(
          { pageId: pageDetails.id, payload },
          {
            onSuccess: () => {
              toast.success("Page updated successfully!");
              handleClose();
            },
            onError: () => {
              toast.error("Failed to update page. Please try again.");
            },
          },
        );
      } else {
        createPage(payload);
      }
    },
    [createPage, isEditMode, pageDetails, updatePageMutate, handleClose],
  );

  const categorySpecificFields = useMemo(() => {
    switch (selectedCategory) {
      case PageCategory.COMPANY:
        return <CompanyFields />;
      case PageCategory.EVENT:
        return <EventFields />;
      case PageCategory.COMMUNITY:
        return <CommunityFields />;
      default:
        return null;
    }
  }, [selectedCategory]);

  return (
    <Modal
      open={open}
      onCancel={handleClose}
      footer={null}
      destroyOnHidden
      width={620}
      centered
      title={null}
      closable
      styles={{
        body: { padding: 0 },
        container: { borderRadius: 14, overflow: "hidden" },
      }}
    >
      {/* ── Hero: Cover + Profile Image Upload ──────────── */}
      <PageImageUpload
        onCoverChange={(file) => {
          coverImageRef.current = file;
          setHasImages((prev) => ({ ...prev, cover: !!file }));
        }}
        onProfileChange={(file) => {
          profileImageRef.current = file;
          setHasImages((prev) => ({ ...prev, profile: !!file }));
        }}
        initialCoverUrl={pageDetails?.cover_image ?? undefined}
        initialProfileUrl={pageDetails?.profile_image ?? undefined}
      />

      {/* ── Form Content ───────────────────────────────── */}
      <div style={{ padding: "0 24px 24px" }}>
        {/* Title */}
        <div style={{ marginBottom: 20 }}>
          <Text
            strong
            style={{
              fontSize: 20,
              display: "block",
              lineHeight: 1.3,
            }}
          >
            {isEditMode ? "Edit Page" : "Create a New Page"}
          </Text>
          <Text type="secondary" style={{ fontSize: 13 }}>
            {isEditMode
              ? "Update your page details below."
              : "Set up your presence — share, connect, and grow."}
          </Text>
        </div>

        <Form
          form={form}
          layout="vertical"
          initialValues={isEditMode ? undefined : createPageDefaultValues}
          onFinish={handleSubmit}
          requiredMark="optional"
          scrollToFirstError
        >
          {/* ── Page Name ──────────────────────────────── */}
          <Form.Item
            name="page_name"
            label="Page Name"
            required
            rules={[{ validator: validator("page_name") }]}
          >
            <Input
              placeholder="Give your page a memorable name"
              maxLength={100}
              showCount
              size="large"
              style={{ borderRadius: 8 }}
            />
          </Form.Item>

          {/* ── Category Selector ──────────────────────── */}
          <Form.Item
            name="category"
            label="Category"
            required
            rules={[{ validator: validator("category") }]}
          >
            <CategorySelector />
          </Form.Item>

          {/* ── Bio ────────────────────────────────────── */}
          <Form.Item
            name="bio"
            label="Bio"
            required
            rules={[{ validator: validator("bio") }]}
          >
            <Input.TextArea
              placeholder="Tell people what this page is about..."
              maxLength={500}
              showCount
              autoSize={{ minRows: 2, maxRows: 4 }}
              style={{ borderRadius: 8 }}
            />
          </Form.Item>

          {/* ── Category-Specific Fields ─────────────── */}
          {categorySpecificFields && (
            <>
              <Divider
                orientation="horizontal"
                style={{ margin: "4px 0 16px", fontSize: 13 }}
              >
                <Text type="secondary" style={{ fontSize: 12 }}>
                  {selectedCategory === PageCategory.COMPANY &&
                    "Company Details"}
                  {selectedCategory === PageCategory.EVENT && "Event Details"}
                  {selectedCategory === PageCategory.COMMUNITY &&
                    "Community Details"}
                </Text>
              </Divider>
              {categorySpecificFields}
            </>
          )}

          {/* ── Location / Website ─────────────────── */}
          <Divider
            orientation="horizontal"
            style={{ margin: "4px 0 16px", fontSize: 13 }}
          >
            <Text type="secondary" style={{ fontSize: 12 }}>
              Location & Web
            </Text>
          </Divider>
          <LocationFields />

          {/* ── Image status hint ──────────────────── */}
          {(hasImages.cover || hasImages.profile) && (
            <div
              style={{
                padding: "8px 12px",
                borderRadius: 8,
                background: `${token.colorPrimary}0a`,
                border: `1px solid ${token.colorPrimary}20`,
                marginBottom: 16,
                fontSize: 12,
                color: token.colorTextSecondary,
              }}
            >
              📷{" "}
              {[
                hasImages.cover && "Cover image",
                hasImages.profile && "Profile image",
              ]
                .filter(Boolean)
                .join(" & ")}{" "}
              attached
            </div>
          )}

          {/* ── Actions ────────────────────────────── */}
          <Form.Item style={{ marginBottom: 0 }}>
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: 10,
                paddingTop: 4,
              }}
            >
              <Button
                onClick={handleClose}
                disabled={isPending}
                size="large"
                style={{ borderRadius: 8, minWidth: 90 }}
              >
                Cancel
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                loading={isPending}
                size="large"
                style={{ borderRadius: 8, minWidth: 130 }}
              >
                {isEditMode ? "Save Changes" : "Create Page"}
              </Button>
            </div>
          </Form.Item>
        </Form>
      </div>
    </Modal>
  );
};

export default AddPageModal;
