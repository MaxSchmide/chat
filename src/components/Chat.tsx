import { useState } from "react"
import { Toaster } from "react-hot-toast"
import { TbDots, TbUserPlus, TbVideo } from "react-icons/tb"
import { useSelector } from "react-redux"
import {
	RootState,
	removeChatUser,
	useAppDispatch,
	useDeleteChatMutation,
} from "../store"
import Input from "./Input"
import Messages from "./Messages"

const Chat = () => {
	const [showModal, setShowModal] = useState(false)
	const { chatUser, chatId, currentUser } = useSelector(
		(state: RootState) => state.user
	)
	const [deleteChat, _] = useDeleteChatMutation()
	const dispatch = useAppDispatch()
	const handleModalShown = () => {
		setShowModal(!showModal)
	}

	const handleDeleteChat = () => {
		// setShowModal(false)
		// deleteChat({ chatUser, chatId, currentUser })
		// dispatch(removeChatUser())
	}

	return (
		<div className="chat">
			<Toaster />
			<div className="chat__info">
				<span>{chatUser?.displayName.split(" ")[0]}</span>
				<div className="chat__info__icons">
					<TbVideo />
					<TbUserPlus />
					<TbDots onClick={handleModalShown} />
					{showModal && (
						<div className="modal" onClick={handleDeleteChat}>
							<p>Delete chat</p>
						</div>
					)}
				</div>
			</div>
			<Messages />
			<Input />
		</div>
	)
}

export default Chat
