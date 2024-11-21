import { configureStore } from "@reduxjs/toolkit";
import workflowReducer from "@/redux/features/workflow/workflowSlice";
import userReducer from "@/redux/features/user/userSlice";

export const makeStore = () => {
  return configureStore({
    reducer: {
      workflow: workflowReducer,
      user: userReducer,
    },
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
