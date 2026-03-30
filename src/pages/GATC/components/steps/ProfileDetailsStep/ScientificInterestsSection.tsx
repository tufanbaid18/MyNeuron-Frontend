import { ExperimentOutlined } from "@ant-design/icons";
import { Col, Divider, Form, Row, Select, Space, Typography } from "antd";
import type { GlobalToken } from "antd/es/theme/interface";
import {
  ADDITIONAL_RESEARCH_AREA_OPTIONS,
  MAJOR_FOCUS_OPTIONS,
  ORGAN_SITE_OPTIONS,
  RESEARCH_AREA_OPTIONS,
  SPECIFIC_RESEARCH_AREA_OPTIONS,
} from "../../../../../constants/gatcRegistration.data";
import { mapOptions } from "../../Registration.utils";

const { Text } = Typography;

interface ScientificInterestsSectionProps {
  token: GlobalToken;
}

export const ScientificInterestsSection = ({
  token,
}: ScientificInterestsSectionProps) => {
  return (
    <>
      <Divider titlePlacement="left" style={{ marginTop: 32 }}>
        <Space>
          <ExperimentOutlined style={{ color: token.colorPrimary }} />
          <Text strong style={{ fontSize: 16, color: token.colorPrimary }}>
            Scientific Interests
          </Text>
        </Space>
      </Divider>

      <Row gutter={16}>
        <Col xs={24} md={12}>
          <Form.Item
            name="research_area_of_expertise"
            label={<span style={{ fontWeight: 500 }}>Research Area</span>}
            rules={[{ required: true, message: "Research area is required" }]}
          >
            <Select
              placeholder="Select research area"
              options={mapOptions(RESEARCH_AREA_OPTIONS)}
              showSearch
            />
          </Form.Item>
        </Col>
        <Col xs={24} md={12}>
          <Form.Item
            name="major_focus"
            label={<span style={{ fontWeight: 500 }}>Major Focus</span>}
            rules={[
              {
                required: true,
                type: "array",
                min: 1,
                message: "At least one major focus is required",
              },
            ]}
          >
            <Select
              mode="multiple"
              placeholder="Select major focus areas"
              options={mapOptions(MAJOR_FOCUS_OPTIONS)}
              showSearch
            />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col xs={24}>
          <Form.Item
            name="specific_research_areas"
            label={
              <span style={{ fontWeight: 500 }}>Specific Research Areas</span>
            }
            rules={[
              {
                required: true,
                type: "array",
                min: 1,
                message: "At least one specific research area is required",
              },
            ]}
          >
            <Select
              mode="multiple"
              placeholder="Search and select areas"
              options={mapOptions(SPECIFIC_RESEARCH_AREA_OPTIONS)}
              showSearch
            />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col xs={24} md={12}>
          <Form.Item
            name="organ_sites"
            label={<span style={{ fontWeight: 500 }}>Organ Sites</span>}
            rules={[
              {
                required: true,
                type: "array",
                min: 1,
                message: "At least one organ site is required",
              },
            ]}
          >
            <Select
              mode="multiple"
              placeholder="Select organ sites"
              options={mapOptions(ORGAN_SITE_OPTIONS)}
              showSearch
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
          >
            <Select
              mode="multiple"
              placeholder="Select additional areas"
              options={mapOptions(ADDITIONAL_RESEARCH_AREA_OPTIONS)}
              showSearch
            />
          </Form.Item>
        </Col>
      </Row>
    </>
  );
};
