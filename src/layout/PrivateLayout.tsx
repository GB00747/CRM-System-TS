import {useEffect, useRef} from "react";
import { Layout, Menu } from "antd";
import { Link, Navigate, useLocation, useNavigate, Outlet } from "react-router-dom";
import {
  UnorderedListOutlined,
  UserOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { logOut, initializeAuth, getRefreshToken } from "@/features/auth/authThunks";
import "antd/dist/reset.css";

const { Header, Sider, Content } = Layout;

export default function PrivateLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();


  const {isLoading,isLogin} = useSelector(state => state.auth)

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    dispatch(initializeAuth())
  }, [dispatch]);

  console.log({isLoading,isLogin})

  useEffect(() => {
    if (isLogin && !intervalRef.current) {
      intervalRef.current = setInterval(() => {
        dispatch(getRefreshToken());
      }, 3 * 60 * 1000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [dispatch, isLogin]);


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

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider theme="light">
        <div style={{ padding: "16px", fontWeight: "bold" }}>Меню</div>
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
