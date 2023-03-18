export type Chats = {
	combinedId: Chat
}
type Chat = {
	date: any
	lastMessage?: IMessage
	userInfo: UserInfo
}
export type UserInfo = {
	email?: string
	displayName: string
	photoURL: string
	uid: string
}

export interface IMessage {
	text?: string
	date?: any
	id?: string
	img?: string
	senderId?: string
	file?: string
}
