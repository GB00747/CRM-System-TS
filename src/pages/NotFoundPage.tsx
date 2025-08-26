import { useNavigate } from "react-router-dom";
import { Result, Button } from "antd";

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <Result
      status="404"
      title="404"
      subTitle="Страница не найдена"
      extra={
        <Button type="primary" onClick={() => navigate("/")}>
          Перейти на страницу входа
        </Button>
      }
    />
  );
}
