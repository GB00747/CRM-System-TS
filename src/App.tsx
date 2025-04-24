import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useLocation,
} from "react-router-dom";
import { TodoListPage } from "./pages/TodoListPage";
import { ProfilePage } from "./pages/ProfilePage";
import "antd/dist/reset.css";
import { Layout, Menu } from "antd";
import { UnorderedListOutlined, UserOutlined } from "@ant-design/icons";

const { Header, Sider, Content } = Layout;

function App() {
  return (
    <Router>
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
            <Routes>
              <Route path="/" element={<TodoListPage />} />
              <Route path="/profile" element={<ProfilePage />} />
            </Routes>
          </Content>
        </Layout>
      </Layout>
    </Router>
  );
}

// Отдельный компонент меню для подсветки активного пункта
function CustomMenu() {
  const location = useLocation();

  return (
    <Menu
      mode="inline"
      selectedKeys={[location.pathname]}
      items={[
        {
          key: "/",
          icon: <UnorderedListOutlined />,
          label: <Link to="/">Задачи</Link>,
        },
        {
          key: "/profile",
          icon: <UserOutlined />,
          label: <Link to="/profile">Профиль</Link>,
        },
      ]}
    />
  );
}

export default App;
