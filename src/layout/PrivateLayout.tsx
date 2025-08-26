import {useEffect} from "react";
import {Layout, Menu} from "antd";
import {Link, Outlet, useLocation, useNavigate} from "react-router-dom";
import {
  LogoutOutlined,
  UnorderedListOutlined,
  UserOutlined,
} from "@ant-design/icons";
import {useDispatch, useSelector} from "react-redux";
import {initializeAuth, logOut} from "@/features/auth/authThunks";
import "antd/dist/reset.css";
import {Roles} from '@/features/auth/authTypes.ts'

const {Header, Sider, Content} = Layout;

export default function PrivateLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();


  const {isLoading, isLogin, user} = useSelector(state => state.auth)


  useEffect(() => {
    dispatch(initializeAuth())
    const interval = setInterval(() => {
      dispatch(initializeAuth())
    }, 1000 * 60 * 2)

    return () => {
      clearInterval(interval)
    }
  }, [dispatch]);

  console.log({isLoading, isLogin})


  /*if (isLoading) {
    return <div>Загрузка...</div>
  }

  if (!isLogin) {
    return <Navigate
      to='/auth'
      replace
    />
  }*/

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
    ...(user?.roles?.some(role => role === Roles.ADMIN || role === Roles.MODERATOR)
      ? [{
        key: "/app/users",
        icon: <UserOutlined />,
        label: <Link to="/app/users">Пользователи</Link>,
      }]
      : []),
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: "Выйти",
      onClick: handleLogout,
    },
  ]

  return (
    <Layout style={{minHeight: "100vh"}}>
      <Sider theme="light">
        <div style={{padding: "16px", fontWeight: "bold"}}>Меню</div>
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
          <h1 style={{margin: 0}}>ToDo App</h1>
        </Header>

        <Content style={{padding: "1rem", backgroundColor: "#fff"}}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}
