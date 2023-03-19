import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react"
import {
	Timestamp,
	arrayUnion,
	collection,
	deleteDoc,
	deleteField,
	doc,
	getDocs,
	query,
	serverTimestamp,
	updateDoc,
	where,
} from "firebase/firestore"
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage"
import { v4 as uuid } from "uuid"
import { db, storage } from "../../firebase"
import { UserInfo } from "../../models/main.model"

const chatApi = createApi({
	reducerPath: "chat",
	baseQuery: fakeBaseQuery(),
	endpoints(builder) {
		return {
			searchUser: builder.query<UserInfo[], any>({
				async queryFn(userName: string) {
					try {
						let searchedUsers: UserInfo[] = []
						const q = query(
							collection(db, "users"),
							where("displayName", "==", userName)
						)
						const querySnapshot = await getDocs(q)
						querySnapshot.forEach((doc) => {
							searchedUsers.push(doc.data() as UserInfo)
						})
						return { data: searchedUsers }
					} catch (error: any) {
						console.error(error.message)
						return { error: error.message }
					}
				},
			}),
			sendMessage: builder.mutation<any, any>({
				async queryFn({ chatUser, currentUser, chatId, image, text }) {
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
									console.log(error.message)
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
					} catch (e: any) {
						console.log(e.message)
						return { error: e.message }
					}

					return {
						data: null,
					}
				},
			}),
			deleteChat: builder.mutation<any, any>({
				async queryFn({ chatId, currentUser, chatUser }) {
					try {
						await deleteDoc(doc(db, "chats", chatId))
						await updateDoc(doc(db, "userChats", currentUser!.uid), {
							[chatId]: deleteField(),
						})
						await updateDoc(doc(db, "userChats", chatUser!.uid), {
							[chatId]: deleteField(),
						})
						return { data: null }
					} catch (e: any) {
						console.log(e.message)
						return {
							error: e.message,
						}
					}
				},
			}),
		}
	},
})
export const {
	useSearchUserQuery,
	useSendMessageMutation,
	useDeleteChatMutation,
} = chatApi

export { chatApi }
