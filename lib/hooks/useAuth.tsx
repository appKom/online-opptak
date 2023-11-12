import { useEffect } from "react";
import { useRouter } from "next/router";
import { useSelector, useDispatch } from "react-redux";
import { fetchProfile } from "../redux/profileSlice";

export const useAuth = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const profile = useSelector((state) => state.profile.data);
  const status = useSelector((state) => state.profile.status);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchProfile());
    }
  }, [status, dispatch]);

  useEffect(() => {
    if (status === "failed" && !profile) {
      router.push("/login");
    }
  }, [profile, status]);

  return { profile, status };
};
