import {useEffect} from "react";
import { Layout, Menu } from "antd";
import { Link, Navigate, useLocation, useNavigate, Outlet } from "react-router-dom";
import {
  UnorderedListOutlined,
  UserOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { logOut, initializeAuth} from "@/features/auth/authThunks";
import "antd/dist/reset.css";

const { Header, Sider, Content } = Layout;

export default function PrivateLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();


  const {isLoading,isLogin} = useSelector(state => state.auth)


  useEffect(() => {
    dispatch(initializeAuth())
  }, [dispatch]);

  console.log({isLoading,isLogin})




  if (isLoading) {
    return <div>Загрузка...</div>
  }

  if (!isLogin) {
    return <Navigate
      to='/auth'
      replace
    />
  }
  const handleLogout = () => {
    dispatch(logOut());
    navigate("/");
  };

  const menuItems = [
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
  ]

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider theme="light">
        <div style={{ padding: "16px", fontWeight: "bold" }}>Меню</div>
        <Menu
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
        />
      </Sider>

      <Layout>
        <Header
          style={{
            backgroundColor: "#fff",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <h1 style={{ margin: 0 }}>ToDo App</h1>
        </Header>

        <Content style={{ padding: "1rem", backgroundColor: "#fff" }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}
