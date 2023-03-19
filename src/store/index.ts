import { configureStore } from "@reduxjs/toolkit"
import { useDispatch } from "react-redux"
import { userReducer } from "./slices/userSlice"
import { chatApi } from "./apis/chatApi"

const store = configureStore({
	reducer: {
		user: userReducer,
		[chatApi.reducerPath]: chatApi.reducer,
	},
	middleware: (getDefaultMiddleware) => {
		return getDefaultMiddleware().concat(chatApi.middleware)
	},
})

export * from "./slices/userSlice"
export * from "./apis/chatApi"
export { store }
export type AppDispatch = typeof store.dispatch
export const useAppDispatch = () => useDispatch<AppDispatch>()
export type RootState = ReturnType<typeof store.getState>
