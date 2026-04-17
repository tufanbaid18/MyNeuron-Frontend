import {
  AppstoreOutlined,
  BankOutlined,
  CalendarOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import { theme, Typography } from "antd";
import type { ReactNode } from "react";
import { PageCategory } from "../../../types/impulse/page.types";

const { useToken } = theme;
const { Text } = Typography;

interface CategorySelectorProps {
  value?: PageCategory;
  onChange?: (value: PageCategory) => void;
}

type CategoryOption = {
  value: PageCategory;
  label: string;
  description: string;
  icon: ReactNode;
  gradient: string;
};

const CATEGORY_OPTIONS: CategoryOption[] = [
  {
    value: PageCategory.GENERAL,
    label: "General",
    description: "Share ideas & thoughts",
    icon: <AppstoreOutlined />,
    gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  },
  {
    value: PageCategory.COMPANY,
    label: "Company",
    description: "For your organization",
    icon: <BankOutlined />,
    gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
  },
  {
    value: PageCategory.EVENT,
    label: "Event",
    description: "Conference or meetup",
    icon: <CalendarOutlined />,
    gradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
  },
  {
    value: PageCategory.COMMUNITY,
    label: "Community",
    description: "Build your tribe",
    icon: <TeamOutlined />,
    gradient: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
  },
];

const CategorySelector = ({ value, onChange }: CategorySelectorProps) => {
  const { token } = useToken();

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gap: 10,
      }}
    >
      {CATEGORY_OPTIONS.map((option) => {
        const isActive = value === option.value;
        return (
          <div
            key={option.value}
            onClick={() => onChange?.(option.value)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") onChange?.(option.value);
            }}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 6,
              padding: "14px 8px 12px",
              borderRadius: 10,
              cursor: "pointer",
              border: `1.5px solid ${isActive ? token.colorPrimary : token.colorBorderSecondary}`,
              background: isActive
                ? `${token.colorPrimary}08`
                : token.colorBgContainer,
              transition: "all 0.25s ease",
              outline: "none",
            }}
          >
            {/* Icon circle */}
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: "50%",
                background: isActive ? option.gradient : token.colorFillTertiary,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 18,
                color: isActive ? "#fff" : token.colorTextSecondary,
                transition: "all 0.25s ease",
              }}
            >
              {option.icon}
            </div>

            <Text
              strong={isActive}
              style={{
                fontSize: 13,
                color: isActive ? token.colorPrimary : token.colorText,
                textAlign: "center",
                lineHeight: 1.2,
              }}
            >
              {option.label}
            </Text>
            <Text
              type="secondary"
              style={{
                fontSize: 11,
                textAlign: "center",
                lineHeight: 1.2,
              }}
            >
              {option.description}
            </Text>
          </div>
        );
      })}
    </div>
  );
};

export default CategorySelector;
