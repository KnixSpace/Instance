"use client";
import { initializeUser } from "@/lib/features/user/userSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { ReactNode, useEffect } from "react";
import axios from "axios";

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_URL}/auth/data`,
          {
            withCredentials: true,
          }
        );
        if (response.status === 200) {
          dispatch(initializeUser(response.data));
        }
      } catch (error: any) {
        console.log(error.response.data);
      }
    };
    checkAuth();
  }, [dispatch]);

  return <>{children}</>;
};
export default AuthProvider;
