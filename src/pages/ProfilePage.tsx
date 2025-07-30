import {useDispatch, useSelector} from "react-redux";
import {RootState} from "@/app/store";
import InfoCard from "@/components/UsersTable/InfoCard.tsx";
import {updateProfile} from "@/features/auth/authThunks.ts";


export default function ProfilePage() {

  const {user,error} = useSelector<RootState>((state) => state.auth);
  const dispatch = useDispatch()

  const handleUpdateUserProfile = (newValues) => {
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