import {
	Timestamp,
	arrayUnion,
	doc,
	serverTimestamp,
	updateDoc,
} from "firebase/firestore"
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage"
import { useState } from "react"
import { toast } from "react-hot-toast"
import { TbPaperclip, TbPhotoCheck, TbPhotoPlus, TbSend } from "react-icons/tb"
import { useSelector } from "react-redux"
import { v4 as uuid } from "uuid"
import { db, storage } from "../firebase"
import { RootState } from "../store"

const Input = () => {
	const [text, setText] = useState("")
	const [image, setImage] = useState<File | null>(null)

	const { currentUser, chatId, chatUser } = useSelector(
		(state: RootState) => state.chat
	)

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setImage(e.target.files![0])
	}

	const handleKey = (e: React.KeyboardEvent) => {
		e.code === "Enter" && handleSend()
	}

	const handleSend = async () => {
		try {
			if (image) {
				const storageRef = ref(storage, uuid())
				const uploadTask = uploadBytesResumable(storageRef, image)

				uploadTask.on(
					"state_changed",
					(snapshot) => {
						const progress =
							(snapshot.bytesTransferred / snapshot.totalBytes) * 100
						console.log("Upload is " + progress + "% done")
						switch (snapshot.state) {
							case "paused":
								console.log("Upload is paused")
								break
							case "running":
								console.log("Upload is running")
								break
						}
					},
					(error: any) => {
						toast.error("Something went wrong")
					},
					() => {
						getDownloadURL(uploadTask.snapshot.ref).then(
							async (downloadURL) => {
								await updateDoc(doc(db, "chats", chatId), {
									messages: arrayUnion({
										id: uuid(),
										text,
										senderId: currentUser?.uid,
										date: Timestamp.now(),
										img: downloadURL,
									}),
								})
							}
						)
					}
				)
			} else {
				await updateDoc(doc(db, "chats", chatId), {
					messages: arrayUnion({
						id: uuid(),
						text,
						senderId: currentUser?.uid,
						date: Timestamp.now(),
					}),
				})
			}
			await updateDoc(doc(db, "userChats", currentUser!.uid), {
				[chatId + ".lastMessage"]: { text },
				[chatId + ".date"]: serverTimestamp(),
			})
			await updateDoc(doc(db, "userChats", chatUser!.uid), {
				[chatId + ".lastMessage"]: { text },
				[chatId + ".date"]: serverTimestamp(),
			})
			setText("")
			setImage(null)
		} catch (e) {
			toast.error("Something went wrong")
		}
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
					onChange={(e) => handleChange(e)}
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
