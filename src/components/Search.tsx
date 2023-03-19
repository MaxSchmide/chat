import {
	doc,
	getDoc,
	serverTimestamp,
	setDoc,
	updateDoc,
} from "firebase/firestore"
import React, { useState } from "react"
import { useSelector } from "react-redux"
import { db } from "../firebase"
import { useDebounce } from "../hooks/useDebounce"
import { UserInfo } from "../models/main.model"
import { RootState, changeChatUser, useAppDispatch } from "../store"
import { useSearchUserQuery } from "../store/apis/chatApi"

const Search = () => {
	const [userName, setUserName] = useState("")
	const nameOfUser = useDebounce(userName, 800)
	const { data, isSuccess } = useSearchUserQuery(nameOfUser)
	const dispatch = useAppDispatch()
	const { currentUser } = useSelector((state: RootState) => state.user)

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setUserName(e.target.value)
	}

	const handleSelect = async () => {
		let user: UserInfo | null = null
		data?.map((u) => (user = u))
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
		user = null
		setUserName("")
	}

	return (
		<div className="search">
			<div className="search__form">
				<input
					type="text"
					value={userName}
					onChange={(e) => handleChange(e)}
					placeholder="Find a user"
				/>
			</div>
			{data?.length
				? data?.map((user) => (
						<div onClick={handleSelect} className="search__chat" key={user.uid}>
							<img src={user.photoURL!} alt="" />
							<div>
								<span>{user.displayName}</span>
							</div>
						</div>
				  ))
				: nameOfUser &&
				  isSuccess && (
						<div className="search__fail">
							<div>
								<span>No matches</span>
							</div>
						</div>
				  )}
		</div>
	)
}

export default Search
