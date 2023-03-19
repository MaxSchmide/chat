import { doc, onSnapshot } from "firebase/firestore"
import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { db } from "../firebase"
import { Chat, Chats, UserInfo } from "../models/main.model"
import { RootState, changeChatUser, useAppDispatch } from "../store"

const ChatsList = () => {
	const [chats, setChats] = useState<Chat[] | null>(null)
	const { currentUser, chatId } = useSelector((state: RootState) => state.user)
	const dispatch = useAppDispatch()
	const handleSelect = (user: UserInfo) => {
		dispatch(changeChatUser(user))
	}
	useEffect(() => {
		const unsub = onSnapshot(
			doc(db, "userChats", currentUser!.uid),
			(document) => {
				setChats(Object.values(document.data() as Chats))
			}
		)
		return () => {
			unsub()
		}
	}, [currentUser!.uid])

	return (
		<div className="list">
			{chats &&
				chats
					.sort((a, b) => b.date - a.date)
					.map((chat, i) => {
						return (
							<div
								className="list__chat"
								key={i}
								onClick={() => handleSelect(chat.userInfo)}
							>
								<img src={chat.userInfo.photoURL} alt="" />
								<div className="list__chat__info">
									<span>{chat.userInfo.displayName}</span>
									<p>{chat.lastMessage?.text}</p>
								</div>
							</div>
						)
					})}
		</div>
	)
}

export default ChatsList
