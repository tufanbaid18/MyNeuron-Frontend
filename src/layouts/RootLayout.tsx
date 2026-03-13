import { Outlet } from "@tanstack/react-router";
import { Layout } from "antd";
import { Content, Header } from "antd/es/layout/layout";
import Sider from "antd/es/layout/Sider";

const RootLayout = () => {
  return (
    <Layout className="w-full h-full">
      <Header>Header</Header>
      <Layout>
        <Sider width={250} className="border-r border-gray-200">
          Sidebar
        </Sider>
        <Content>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default RootLayout;
