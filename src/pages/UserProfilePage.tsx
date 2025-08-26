import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "@/app/store.ts";
import {Spin} from "antd";
import {updateUserProfile} from "@/features/users/usersThunks.ts";
import InfoCard from "@/components/UsersTable/InfoCard.tsx";
import {UserRequest} from "@/features/users/usersTypes.ts";

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



  if (pending) {
    return <Spin
      tip="Загрузка пользователя..."
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