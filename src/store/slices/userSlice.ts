import { createSlice } from "@reduxjs/toolkit/src"
import { UserInfo } from "../../models/main.model"

type InitialState = {
	currentUser: UserInfo | null
	chatId: string
	chatUser: UserInfo | null
}

const initialState: InitialState = {
	currentUser: null,
	chatId: "",
	chatUser: null,
}

const userSlice = createSlice({
	name: "user",
	initialState,
	reducers: {
		signIn: (state, action) => {
			return {
				...state,
				currentUser: action.payload,
			}
		},
		logOut: (state) => {
			return { ...state, currentUser: null, chatId: "", chatUser: null }
		},
		changeChatUser: (state, action) => {
			return {
				...state,
				chatUser: action.payload,
				chatId:
					state.currentUser!.uid > action.payload.uid
						? state.currentUser?.uid + action.payload.uid
						: action.payload.uid + state.currentUser?.uid,
			}
		},
		removeChatUser: (state) => {
			return {
				...state,
				chatUser: null,
				chatId: "",
			}
		},
	},
})

export const { signIn, logOut, changeChatUser, removeChatUser } =
	userSlice.actions
export const userReducer = userSlice.reducer
