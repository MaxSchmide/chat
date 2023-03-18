import { doc, onSnapshot } from "firebase/firestore"
import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { db } from "../firebase"
import { IMessage } from "../models/main.model"
import { RootState } from "../store"
import Message from "./Message"

const Messages = () => {
	const [messages, setMessages] = useState<IMessage[]>([])

	const { chatId } = useSelector((state: RootState) => state.chat)

	useEffect(() => {
		const getMessages = () => {
			const unsub = onSnapshot(doc(db, "chats", chatId), (doc) => {
				doc.exists() && setMessages(doc.data().messages)
			})
			return () => unsub()
		}
		chatId && getMessages()
	}, [chatId])

	return (
		<div className="messages">
			{messages && messages.map((m) => <Message message={m} key={m.id} />)}
		</div>
	)
}

export default Messages
