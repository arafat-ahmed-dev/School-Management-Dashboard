"use client"

import { useAppSelector } from "@/lib/store/hooks";
import _ from "lodash";

export const useUserRole = () => {
  const response = useAppSelector((state) => state.auth?.userData?.userRole);
  const role = _.toLower(response);
  return role;
}