import { doc, getDoc, onSnapshot, where } from "firebase/firestore"
import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { db } from "../firebase"
import { Chats, UserInfo } from "../models/main.model"
import {
	RootState,
	changeChatUser,
	removeChatUser,
	useAppDispatch,
} from "../store"

const ChatsList = () => {
	const [chats, setChats] = useState<Chats | null>(null)

	const { currentUser, chatId } = useSelector((state: RootState) => state.chat)
	const dispatch = useAppDispatch()
	const handleSelect = (user: UserInfo) => {
		dispatch(changeChatUser(user))
	}

	useEffect(() => {
		const unsub = onSnapshot(
			doc(db, "userChats", currentUser!.uid),
			async (document) => {
				setChats(document.data() as Chats)
			}
		)
		return () => {
			unsub()
		}
	}, [currentUser!.uid])

	return (
		<div className="list">
			{chats &&
				Object.entries(chats)
					.sort((a, b) => b[1].date - a[1].date)
					.map((chat) => {
						return (
							<div
								className="list__chat"
								key={chat[0]}
								onClick={() => handleSelect(chat[1].userInfo)}
							>
								<img src={chat[1].userInfo.photoURL} alt="" />
								<div className="list__chat__info">
									<span>{chat[1].userInfo.displayName}</span>
									<p>{chat[1].lastMessage?.text}</p>
								</div>
							</div>
						)
					})}
		</div>
	)
}

export default ChatsList
