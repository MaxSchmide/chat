import {
	collection,
	doc,
	getDoc,
	getDocs,
	query,
	serverTimestamp,
	setDoc,
	updateDoc,
	where,
} from "firebase/firestore"
import React, { useState } from "react"
import { toast } from "react-hot-toast"
import { useSelector } from "react-redux"
import { db } from "../firebase"
import { UserInfo } from "../models/main.model"
import { RootState, changeChatUser, useAppDispatch } from "../store"

const Search = () => {
	const [userName, setUserName] = useState("")
	const [user, setUser] = useState<UserInfo | null>(null)

	const dispatch = useAppDispatch()
	const { currentUser } = useSelector((state: RootState) => state.chat)

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setUserName(e.target.value)
	}

	const handleSelect = async () => {
		const combinedId =
			currentUser!.uid > user!.uid
				? currentUser!.uid + user!.uid
				: user!.uid + currentUser!.uid

		try {
			const res = await getDoc(doc(db, "chats", combinedId))
			if (!res.exists()) {
				await setDoc(doc(db, "chats", combinedId), { messages: [] })

				await updateDoc(doc(db, "userChats", currentUser!.uid), {
					[combinedId + ".userInfo"]: {
						uid: user!.uid,
						displayName: user!.displayName,
						photoURL: user!.photoURL,
					},
					[combinedId + ".date"]: serverTimestamp(),
				})
				await updateDoc(doc(db, "userChats", user!.uid), {
					[combinedId + ".userInfo"]: {
						uid: currentUser!.uid,
						displayName: currentUser!.displayName,
						photoURL: currentUser!.photoURL,
					},
					[combinedId + ".date"]: serverTimestamp(),
				})
			}
			dispatch(changeChatUser(user))
		} catch (e) {
			console.log(e)
		}
		setUser(null)
		setUserName("")
	}

	const handleKey = (e: React.KeyboardEvent) => {
		e.code === "Enter" && handleSearch()
	}

	const handleSearch = async () => {
		const q = query(
			collection(db, "users"),
			where("displayName", "==", userName)
		)
		try {
			const querySnapshot = await getDocs(q)
			querySnapshot.forEach((doc) => {
				setUser(doc.data() as UserInfo)
			})
		} catch (e) {
			toast.error("Something went wrong")
		}
	}

	return (
		<div className="search">
			<div className="search__form">
				<input
					type="text"
					value={userName}
					onKeyDown={(e) => handleKey(e)}
					onChange={(e) => handleChange(e)}
					placeholder="Find a user"
				/>
			</div>
			{user && (
				<div onClick={handleSelect} className="search__chat">
					<img src={user?.photoURL!} alt="" />
					<div className="search__chat__info">
						<span>{user?.displayName}</span>
					</div>
				</div>
			)}
		</div>
	)
}

export default Search
