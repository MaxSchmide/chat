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

const chatSlice = createSlice({
	name: "chat",
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
	chatSlice.actions
export const chatReducer = chatSlice.reducer
