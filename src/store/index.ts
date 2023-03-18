import { configureStore } from "@reduxjs/toolkit"
import { useDispatch } from "react-redux"
import { chatReducer } from "./slices/chatSlice"

const store = configureStore({
	reducer: {
		chat: chatReducer,
	},
	
})

export * from "./slices/chatSlice"
export { store }
export type AppDispatch = typeof store.dispatch
export const useAppDispatch = () => useDispatch<AppDispatch>()
export type RootState = ReturnType<typeof store.getState>
