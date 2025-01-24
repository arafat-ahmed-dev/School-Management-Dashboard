"use client";
import _ from "lodash";
import { useAppSelector } from "./store/hooks";

const useUserRole = () => {
  const response = useAppSelector((state) => state.auth.userData?.userRole);
  const role = _.toLower(response);
  return role;
};

export default useUserRole;
