import { Grid, Typography } from "antd";
import type { GlobalToken } from "antd/es/theme/interface";

const { Title, Paragraph } = Typography;
const { useBreakpoint } = Grid;

interface RegistrationHeroBannerProps {
  token: GlobalToken;
}

export const RegistrationHeroBanner = ({
  token,
}: RegistrationHeroBannerProps) => {
  const screens = useBreakpoint();

  return (
    <div
      style={{
        background: `linear-gradient(135deg, ${token.colorPrimary} 0%, #7c3aed 100%)`,
        padding: screens.md ? "48px 32px 64px" : "32px 16px 48px",
        textAlign: "center",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Decorative circles */}
      <div
        style={{
          position: "absolute",
          top: "-80px",
          right: "-80px",
          width: "300px",
          height: "300px",
          borderRadius: "50%",
          background: "rgba(255,255,255,0.06)",
          filter: "blur(30px)",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "-50px",
          left: "10%",
          width: "200px",
          height: "200px",
          borderRadius: "50%",
          background: "rgba(255,255,255,0.08)",
          filter: "blur(20px)",
        }}
      />

      <Title
        level={screens.md ? 2 : 3}
        style={{ color: "#fff", margin: 0, fontWeight: 700 }}
      >
        GATC 2026 Registration
      </Title>
      <Paragraph
        style={{
          color: "rgba(255,255,255,0.8)",
          fontSize: 16,
          marginBottom: 0,
          marginTop: 8,
        }}
      >
        International Genomics Advancements Through Convergence
      </Paragraph>
    </div>
  );
};
