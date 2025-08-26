import {useDispatch, useSelector} from "react-redux";
import {RootState, AppDispatch} from "@/app/store";
import InfoCard from "@/components/UsersTable/InfoCard.tsx";
import {updateProfile} from "@/features/auth/authThunks.ts";
import {UserRequest} from "@/features/users/usersTypes.ts";


export default function ProfilePage() {

  const {user,error} = useSelector<RootState>((state) => state.auth);
  const dispatch = useDispatch<AppDispatch>();

  const handleUpdateUserProfile = (newValues: UserRequest) => {
    dispatch(updateProfile(newValues))
  }

  return (
    <InfoCard
      user={user}
      error={error}
      handleUpdateUserProfile={handleUpdateUserProfile}
    />
  );
}