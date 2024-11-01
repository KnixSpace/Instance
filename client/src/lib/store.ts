import { configureStore } from "@reduxjs/toolkit";
import workflowReducer from "@/lib/features/workflow/workflowSlice";

export const makeStore = () => {
  return configureStore({
    reducer: {
      workflow: workflowReducer,
    },
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];