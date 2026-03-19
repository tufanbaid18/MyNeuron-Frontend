import type { SelectProps } from "antd";
import { Select } from "antd";

type OptionType = {
  label: string;
  value: string;
};

type Variant = "borderless" | "filled" | "outlined" | "underlined";
type CustomSelectProps = {
  variant?: Variant;
  disabled?: boolean;
  options: (string | OptionType)[];
  value?: string | string[];
  onChange?: (value: string | string[]) => void;
  mode?: "multiple" | "tags";
  placeholder?: string;
  maxTagCount?: number | "responsive";
  showSearch?: boolean;
  optionFilterProp?: string;
  allowClear?: boolean;
  className?: string;
  style?: React.CSSProperties;
} & Omit<SelectProps, "options" | "value" | "onChange" | "mode">;

export default function CustomSelect({
  variant,
  options = [],
  disabled,
  value,
  onChange,
  mode,
  placeholder = "Select",
  maxTagCount = "responsive",
  showSearch = true,
  optionFilterProp = "label",
  allowClear = true,
  className = "",
  style = {},
  ...rest
}: CustomSelectProps) {
  const formattedOptions: OptionType[] = options.map((opt) =>
    typeof opt === "string" ? { label: opt, value: opt } : opt,
  );

  return (
    <div className="w-full">
      <Select
        variant={variant}
        mode={mode}
        disabled={disabled}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        options={formattedOptions}
        showSearch={showSearch}
        popupClassName=""
        optionFilterProp={optionFilterProp}
        allowClear={allowClear}
        maxTagCount={mode ? maxTagCount : undefined}
        className={`w-full ${className}`}
        style={{
          width: "100%",
          minHeight: "40px",
          ...style,
        }}
        getPopupContainer={(trigger) => trigger.parentNode}
        {...rest}
      />
    </div>
  );
}
