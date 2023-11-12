import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { clearProfile, fetchProfile } from "../redux/profileSlice";
import Cookies from "js-cookie";
import { AppDispatch, RootState } from "../redux/store";
import { UserProfile } from "../types";

export const useAuth = () => {
  const dispatch = useDispatch<AppDispatch>();
  const profile = useSelector(
    (state: RootState) => state.profile.data as UserProfile | null
  );
  const status = useSelector((state: RootState) => state.profile.status);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchProfile());
    }
  }, [status, dispatch]);

  const logoutUser = () => {
    dispatch(clearProfile());
    Cookies.remove("token");
  };

  return { profile, status, logoutUser };
};
