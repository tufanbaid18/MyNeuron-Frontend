import { Outlet } from "@tanstack/react-router";
import { Layout } from "antd";
import { Content, Header } from "antd/es/layout/layout";
import Sider from "antd/es/layout/Sider";

const RootLayout = () => {
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Header>header</Header>
      <Layout>
        <Sider>left sidebar</Sider>
        <Content>
          <Outlet />
        </Content>
      </Layout>
      {/* <Footer>footer</Footer> */}
    </Layout>
  );
};

export default RootLayout;
