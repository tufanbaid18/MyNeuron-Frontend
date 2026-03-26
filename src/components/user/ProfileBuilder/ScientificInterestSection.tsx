import React, { useState, useEffect } from "react";
import {
  Form,
  Input,
  Button,
  Select,
  Typography,
  Skeleton,
  Space,
  Row,
  Col,
  Tag,
} from "antd";
import { EditOutlined, SaveOutlined, CloseOutlined } from "@ant-design/icons";
import {
  useScientificInterest,
  useUpdateScientificInterest,
} from "../../../hooks/user/useUserScientificInterests";
import {
  userScientificInterestSchema,
  type UserScientificInterestForm,
} from "../../../validations/user.schemas";
import { createZodValidator } from "../../../validations/zodValidator";

const { TextArea } = Input;
const { Text, Title } = Typography;

const RESEARCH_AREA_OPTIONS = [
  "Aging and Cancer", "Behavioral and Implementation Science", "Biochemistry and Biophysics",
  "Bioengineering and Biomaterials", "Bioinformatics, Computational Biology, and Systems Biology",
  "Biostatistics", "Cancer Disparities Research", "Cancer Evolution", "Cancer Metabolism",
  "Cancer Modeling", "Cancer Prevention Research", "Cell Biology", "Chemistry and Chemical Biology",
  "Clinical Research", "Clinical Trials", "Convergence Cancer Science",
  "Data Science and Artificial Intelligence", "Developmental Biology", "Diagnostics and Biomarkers",
  "Drug Discovery and Development", "Early Detection and Interception", "Endocrinology", "Epigenetics",
  "Experimental and Molecular Therapeutics", "Genetics", "Genomics", "Immunology", "Microenvironment",
  "Molecular Biology", "Pathology", "Pharmacology and Toxicology", "Population Sciences",
  "Radiation Science and Medicine", "Surgical Oncology", "Survivorship Research", "Translational Research",
  "Tumor Biology / Tumor Microenvironment", "Other",
].map(opt => ({ label: opt, value: opt }));

const MAJOR_FOCUS_OPTIONS = [
  "Advocacy", "Basic Science", "Business Development", "Clinical Practice", "Clinical Research",
  "Population Science", "Regulatory Science and Health Policy", "Research Administration",
  "Science Education", "Science Education and Training", "Translational Research",
].map(opt => ({ label: opt, value: opt }));

const SPECIFIC_RESEARCH_AREA_OPTIONS = [
  "Aging", "AIDS and Cancer", "Angiogenesis", "Animal Models", "Apoptosis",
  "Biochemical Modulators of Therapy and Toxicity", "Biological Response Modifiers", "Biomarkers",
  "Bone Marrow Transplantation", "Cachexia", "Cancer Control and Screening", "Cancer Disparities",
  "Cancer Epidemiology", "Cancer Genetics", "Cancer Immunology", "Cancer Metabolism", "Cancer Stem Cells",
  "Cancer Vaccines", "Carcinogenesis", "Cell Adhesion Molecules", "Cell and Tissue Culture",
  "Cell Cycle Regulation", "Cell Death (Apoptosis)", "Chemoprevention", "Chemotherapy",
  "Chromatin Structure and Function", "Clinical Trials", "Combined Modalities of Therapy",
  "Computational Biology", "DNA Damage and Repair", "DNA Methylation", "Drug Delivery Systems",
  "Drug Metabolism", "Drug Resistance", "Early Detection", "Epigenetics and Epigenomics",
  "Experimental Immunotherapy", "Extracellular Matrix", "Flow Cytometry", "Gene Expression",
  "Gene Therapy", "Genetic Predisposition and Cancer Risk", "Imaging", "Immunobiology",
  "Immunotherapy (Clinical)", "Immunotherapy (Experimental)", "Inflammation", "Invasion and Metastasis",
  "Microbiome Research", "MicroRNAs", "Molecular Carcinogenesis", "Nanotechnology", "Oncogenes",
  "Population-Based Studies", "Precision Medicine", "Radiation Biology", "Radiation Therapy",
  "Signal Transduction", "Single-Cell Analysis", "Stem Cells", "Systems Biology", "Tumor Angiogenesis",
  "Tumor Heterogeneity", "Tumor Immunology", "Tumor Microenvironment", "Tumor Progression",
  "Tumor Suppressor Genes", "Viral Carcinogenesis", "Other",
].map(opt => ({ label: opt, value: opt }));

const ORGAN_SITE_OPTIONS = [
  "Bone", "Brain and Central Nervous System", "Breast", "Colon and Rectum", "Esophagus", "Eye",
  "Gastrointestinal", "Head and Neck", "Kidney", "Larynx", "Leukemia", "Liver", "Lung and Bronchus",
  "Lymphoma", "Melanoma", "Multiple Myeloma", "Neuroblastoma", "Ovary", "Pancreas", "Pediatric",
  "Prostate", "Sarcoma and Soft Tissue", "Skin", "Stomach", "Testis", "Thyroid", "Urinary Bladder",
  "Uterine Cervix", "Uterine Corpus",
].map(opt => ({ label: opt, value: opt }));

const ADDITIONAL_RESEARCH_AREA_OPTIONS = RESEARCH_AREA_OPTIONS;

type ScientificInterestSectionProps = {
  mode?: "profile" | "registration";
};

const ScientificInterestSection: React.FC<ScientificInterestSectionProps> = ({
  mode = "profile",
}) => {
  const [form] = Form.useForm<UserScientificInterestForm>();
  const { data: scientificInt, isLoading } = useScientificInterest();
  const { mutateAsync: updateInterest, isPending } =
    useUpdateScientificInterest();
  const [isEditingState, setIsEditingState] = useState(mode === "registration");

  const isEditing =
    isEditingState || (!isLoading && !scientificInt && mode === "profile");

  const setIsEditing = (val: boolean) => setIsEditingState(val);

  useEffect(() => {
    if (scientificInt && isEditing) {
      form.setFieldsValue({
        research_area_of_expertise:
          scientificInt.research_area_of_expertise || "",
        major_focus: scientificInt.major_focus || [],
        specific_research_areas: scientificInt.specific_research_areas || [],
        organ_sites: scientificInt.organ_sites || [],
        additional_research_areas:
          scientificInt.additional_research_areas || [],
        brief_description: scientificInt.brief_description || "",
      });
    }
  }, [scientificInt, isEditing, form]);

  const handleFinish = async (values: UserScientificInterestForm) => {

    try {
      await updateInterest(values);
      if (mode === "profile") {
        setIsEditing(false);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const zodRule = (
    fieldName: keyof typeof userScientificInterestSchema.shape,
  ) => [
    {
      validator: createZodValidator(userScientificInterestSchema, fieldName, mode),
    },
  ];

  if (isLoading) return <Skeleton active paragraph={{ rows: 6 }} />;

  const renderTags = (tags: string[] | undefined) => {
    if (!tags || tags.length === 0)
      return <Text type="secondary">None specified</Text>;
    return (
      <Space size={[0, 8]} wrap>
        {tags.map((tag) => (
          <Tag color="cyan" key={tag}>
            {tag}
          </Tag>
        ))}
      </Space>
    );
  };

  if (!isEditing && scientificInt) {
    return (
      <div className="animate-fade-in transition-all">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: 16,
          }}
        >
          <Text strong style={{ fontSize: 16 }}>
            Scientific Interests Overview
          </Text>
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => setIsEditing(true)}
            shape="round"
          >
            Edit
          </Button>
        </div>

        <Row style={{ marginBottom: 24 }}>
          <Col span={24}>
            <Title level={5}>Research Area of Expertise</Title>
            <Text>
              {scientificInt.research_area_of_expertise || "Not provided"}
            </Text>
          </Col>
        </Row>

        <Row gutter={[16, 24]} style={{ marginBottom: 24 }}>
          <Col xs={24} md={12}>
            <Title level={5}>Major Focus</Title>
            {renderTags(scientificInt.major_focus)}
          </Col>
          <Col xs={24} md={12}>
            <Title level={5}>Specific Research Areas</Title>
            {renderTags(scientificInt.specific_research_areas)}
          </Col>
          <Col xs={24} md={12}>
            <Title level={5}>Organ Sites</Title>
            {renderTags(scientificInt.organ_sites)}
          </Col>
          <Col xs={24} md={12}>
            <Title level={5}>Additional Research Areas</Title>
            {renderTags(scientificInt.additional_research_areas)}
          </Col>
        </Row>

        <Row>
          <Col span={24}>
            <Title level={5}>Brief Description</Title>
            <Text>{scientificInt.brief_description || "Not provided"}</Text>
          </Col>
        </Row>
      </div>
    );
  }

  return (
    <div className="animate-fade-in transition-all">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 16,
        }}
      >
        <Text strong style={{ fontSize: 16 }}>
          Edit Scientific Interests
        </Text>
        {mode === "profile" && scientificInt && (
          <Button
            icon={<CloseOutlined />}
            onClick={() => setIsEditing(false)}
            shape="circle"
          />
        )}
      </div>

      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        requiredMark="optional"
        size="large"
      >
        <Form.Item
          name="research_area_of_expertise"
          label={
            <span style={{ fontWeight: 500 }}>Research Area of Expertise</span>
          }
          rules={zodRule("research_area_of_expertise")}
          hasFeedback
        >
          <Select 
            placeholder="e.g. Molecular Biology" 
            options={RESEARCH_AREA_OPTIONS}
            showSearch
          />
        </Form.Item>

        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Form.Item
              name="major_focus"
              label={
                <span style={{ fontWeight: 500 }}>
                  Major Focus (Type and press Enter)
                </span>
              }
              rules={zodRule("major_focus")}
              hasFeedback
            >
              <Select
                mode="tags"
                placeholder="e.g. Oncology, Neurodegeneration"
                tokenSeparators={[","]}
                options={MAJOR_FOCUS_OPTIONS}
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              name="specific_research_areas"
              label={
                <span style={{ fontWeight: 500 }}>Specific Research Areas</span>
              }
              rules={zodRule("specific_research_areas")}
              hasFeedback
            >
              <Select
                mode="tags"
                placeholder="e.g. CRISPR, Gene Editing"
                tokenSeparators={[","]}
                options={SPECIFIC_RESEARCH_AREA_OPTIONS}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Form.Item
              name="organ_sites"
              label={<span style={{ fontWeight: 500 }}>Organ Sites</span>}
              rules={zodRule("organ_sites")}
              hasFeedback
            >
              <Select
                mode="tags"
                placeholder="e.g. Brain, Liver"
                tokenSeparators={[","]}
                options={ORGAN_SITE_OPTIONS}
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              name="additional_research_areas"
              label={
                <span style={{ fontWeight: 500 }}>
                  Additional Research Areas (Optional)
                </span>
              }
              rules={zodRule("additional_research_areas")}
              hasFeedback
            >
              <Select
                mode="tags"
                placeholder="Any secondary areas..."
                tokenSeparators={[","]}
                options={ADDITIONAL_RESEARCH_AREA_OPTIONS}
              />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          name="brief_description"
          label={<span style={{ fontWeight: 500 }}>Brief Description</span>}
          rules={zodRule("brief_description")}
          hasFeedback
        >
          <TextArea
            rows={4}
            placeholder="Summarize your scientific interests and overall goals..."
          />
        </Form.Item>

        <Form.Item style={{ marginTop: 24 }}>
          <Space>
            <Button
              type="primary"
              htmlType="submit"
              loading={isPending}
              icon={<SaveOutlined />}
              shape="round"
              size="large"
            >
              Save Scientific Interests
            </Button>
            {mode === "profile" && scientificInt && (
              <Button
                onClick={() => setIsEditing(false)}
                shape="round"
                size="large"
              >
                Cancel
              </Button>
            )}
          </Space>
        </Form.Item>
      </Form>
    </div>
  );
};

export default ScientificInterestSection;
