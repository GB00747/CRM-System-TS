import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "@/app/store.ts";
import {Spin, Typography} from "antd";
import {updateUserProfile} from "@/features/users/usersThunks.ts";
import InfoCard from "@/components/UsersTable/InfoCard.tsx";
import {UserRequest} from "@/features/users/usersTypes.ts";

const { Title } = Typography;

function UserProfilePage() {

  const {
    singleUser,
    pending,
    error
  } = useSelector((state: RootState) => state.user)

  const dispatch = useDispatch<AppDispatch>()

  const handleUpdateUserProfile = async (updateData: UserRequest, id: number) => {
    try {
      await dispatch(updateUserProfile({updateData, id}))
      } catch (error) {
      console.log(error)
    }
  }

  if (pending && !singleUser) {
    return <Spin
      tip="Загрузка пользователей..."
      size="large"
      fullscreen
    />;
  }

  return (
    <InfoCard
      user={singleUser}
      error={error}
      handleUpdateUserProfile={handleUpdateUserProfile}
      userId={singleUser?.id}
    />
  );
}

export default UserProfilePage;