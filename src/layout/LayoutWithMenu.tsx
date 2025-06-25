import { Layout, Menu } from "antd";
import { Link, Outlet, useLocation } from "react-router-dom";
import { UnorderedListOutlined, UserOutlined } from "@ant-design/icons";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "@/features/auth/authSlice";
import { LogoutOutlined } from "@ant-design/icons";
import "antd/dist/reset.css";

const { Header, Sider, Content } = Layout;

const CustomMenu = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };


  return (
    <Menu
      mode="inline"
      selectedKeys={[location.pathname]}
      items={[
        {
          key: "/app/todos",
          icon: <UnorderedListOutlined />,
          label: <Link to="/app/todos">Задачи</Link>,
        },
        {
          key: "/app/profile",
          icon: <UserOutlined />,
          label: <Link to="/app/profile">Профиль</Link>,
        },
        {
          key: "logout",
          icon: <LogoutOutlined />,
          label: "Выйти",
          onClick: handleLogout,
        },
      ]}
    />
  );
};

export const LayoutWithMenu = () => (
  <Layout style={{ minHeight: "100vh" }}>
    <Sider theme="light">
      <div style={{ padding: "16px", fontWeight: "bold" }}>Меню</div>
      <CustomMenu />
    </Sider>
    <Layout>
      <Header
        style={{
          backgroundColor: "#fff",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <h1 style={{ margin: "0" }}> ToDo App</h1>
      </Header>
      <Content style={{ padding: "1rem", backgroundColor: "#fff" }}>
        <Outlet />
      </Content>
    </Layout>
  </Layout>
);

export default LayoutWithMenu