import { useState } from "react"
import { TbPaperclip, TbPhotoCheck, TbPhotoPlus, TbSend } from "react-icons/tb"
import { useSelector } from "react-redux"
import { RootState } from "../store"
import { useSendMessageMutation } from "../store/apis/chatApi"

const Input = () => {
	const [text, setText] = useState("")
	const [image, setImage] = useState<File | null>(null)
	const { currentUser, chatId, chatUser } = useSelector(
		(state: RootState) => state.user
	)
	const [send, _] = useSendMessageMutation()

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setImage(e.target.files![0])
	}

	const handleKey = (e: React.KeyboardEvent) => {
		e.code === "Enter" && handleSend()
	}

	const handleSend = async () => {
		send({ chatUser, currentUser, chatId, image, text })
		setText("")
		setImage(null)
	}

	return (
		<div className="input">
			<input
				type="text"
				placeholder="Type something..."
				onKeyDown={(e) => handleKey(e)}
				onChange={(e) => setText(e.target.value)}
				value={text}
			/>
			<div className="input__send">
				<TbPaperclip className="icon" />
				<input
					type="file"
					onChange={(e) => handleFileChange(e)}
					style={{ display: "none" }}
					id="file"
				/>
				<label htmlFor="file">
					{image ? (
						<TbPhotoCheck className="icon" />
					) : (
						<TbPhotoPlus className="icon" />
					)}
				</label>
				<TbSend className="icon icon--send" onClick={handleSend} />
			</div>
		</div>
	)
}

export default Input
