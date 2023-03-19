import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth"
import { doc, setDoc } from "firebase/firestore"
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage"
import { useEffect, useState } from "react"
import { toast } from "react-hot-toast"
import { TbPhotoCheck, TbPhotoPlus } from "react-icons/tb"
import { Link, useNavigate } from "react-router-dom"
import { auth, db, storage } from "../firebase"

type UserCredentials = {
	email: string
	password: string
	displayName: string
	file: File | null
	err: string
}

const reg =
	/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
const defaultAvatar =
	"https://d32ogoqmya1dw8.cloudfront.net/images/serc/empty_user_icon_256.v2.png"

const RegisterPage = () => {
	const [userCredentials, setUserCredentials] = useState<UserCredentials>({
		email: "",
		password: "",
		displayName: "",
		file: null,
		err: "",
	})
	const navigate = useNavigate()

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		let message = ""

		e.target.name === "displayName" && !e.target.value
			? (e.target.classList.add("error"), (message = "Enter your name"))
			: e.target.name === "password" && e.target.value.length < 6
			? (e.target.classList.add("error"),
			  (message = "Password is too short - should be 6 chars minimum."))
			: e.target.name === "email" && !e.target.value.match(reg)
			? (e.target.classList.add("error"),
			  (message = "Do not valid e-mail adress"))
			: e.target.classList.remove("error")

		setUserCredentials((prev) => {
			return {
				...prev,
				[e.target.name]: e.target.value,
				err: message,
			}
		})
	}
	const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
		setUserCredentials((prev) => {
			return {
				...prev,
				file: e.target.files![0],
			}
		})
	}

	const handleSubmit = async (event: React.ChangeEvent<HTMLFormElement>) => {
		event.preventDefault()
		if (
			userCredentials.displayName &&
			userCredentials.email.match(reg) &&
			userCredentials.password.length >= 6
		) {
			try {
				const res = await createUserWithEmailAndPassword(
					auth,
					userCredentials.email,
					userCredentials.password
				)
				const storageRef = ref(storage, userCredentials.displayName)
				const uploadTask = uploadBytesResumable(
					storageRef,
					userCredentials.file!
				)
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
						console.log(error)
					},
					() => {
						getDownloadURL(uploadTask.snapshot.ref).then(
							async (downloadURL) => {
								await updateProfile(res.user, {
									displayName: userCredentials.displayName,
									photoURL: downloadURL,
								})
								await setDoc(doc(db, "users", res.user.uid), {
									uid: res.user.uid,
									displayName: userCredentials.displayName,
									email: userCredentials.email,
									photoURL: downloadURL,
								})
								await setDoc(doc(db, "userChats", res.user.uid), {})
								navigate("/login")
							}
						)
					}
				)
				toast.success("User created! Please verify your e-mail.")
			} catch (err: any) {
				console.log(err.code)
				if (err.code == "auth/email-already-in-use") {
					toast.error("E-mail already in use")
				}
			}
		} else {
			toast.error("Wrong data")
		}
	}

	useEffect(() => {
		const unsub = async () => {
			const res = await fetch(defaultAvatar)
			const data = await res.blob()
			const file = new File([data], "default.png", {
				type: data.type || "image/jpeg",
			})
			setUserCredentials((prev) => {
				return {
					...prev,
					file: file,
				}
			})
		}

		unsub()
	}, [])

	return (
		<div className="form-container">
			<div className="form-wrapper">
				<span className="logo">Chat</span>
				<span className="title">Register</span>
				<form onSubmit={handleSubmit}>
					<input
						type="text"
						value={userCredentials.displayName}
						name="displayName"
						placeholder="Your name..."
						onChange={(e) => handleChange(e)}
					/>
					<input
						type="email"
						value={userCredentials.email}
						name="email"
						placeholder="Enter your e-mail..."
						onChange={(e) => handleChange(e)}
					/>
					<input
						value={userCredentials.password}
						type="password"
						name="password"
						placeholder="Enter your password..."
						onChange={(e) => handleChange(e)}
					/>
					<input
						type="file"
						id="file"
						onChange={(e) => handleFileUpload(e)}
						style={{ display: "none" }}
					/>
					<label htmlFor="file">
						{userCredentials.file ? (
							<>
								<TbPhotoCheck className="icon" />
								<span>{userCredentials.file.name}</span>
							</>
						) : (
							<>
								<TbPhotoPlus className="icon" />
								<span>Add an avatar</span>
							</>
						)}
					</label>
					{userCredentials.err && (
						<div className="error__info">{userCredentials.err}</div>
					)}
					<button type="submit">Sign up</button>
				</form>
				<p>
					Already have an account? <Link to="/login">Login</Link>
				</p>
			</div>
		</div>
	)
}

export default RegisterPage
