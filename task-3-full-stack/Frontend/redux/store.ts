import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";

import projectReducer from  "./Slices/projectSlice";
import propertyReducer from  "./Slices/propertySlice";

import articleReducer from  "./Slices/articleSlice";
export const store = configureStore({
  reducer: {
 
    articles: articleReducer,
    properties: propertyReducer,
    projects: projectReducer
  },
 
}
);

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
