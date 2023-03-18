import {
	GoogleAuthProvider,
	signInWithEmailAndPassword,
	signInWithPopup,
} from "firebase/auth"
import { useState } from "react"
import { Toaster } from "react-hot-toast"
import { FcGoogle } from "react-icons/fc"
import { Link, useNavigate } from "react-router-dom"
import { auth, db } from "../firebase"
import { UserInfo } from "../models/main.model"
import { signIn, useAppDispatch } from "../store"
import { doc, getDoc, setDoc } from "firebase/firestore"

const LoginPage = () => {
	const [login, setLogin] = useState({
		email: "",
		password: "",
		error: "",
	})
	const dispatch = useAppDispatch()
	const navigate = useNavigate()

	const handleSignInWithGoogle = async () => {
		try {
			const provider = new GoogleAuthProvider()
			provider.addScope("https://www.googleapis.com/auth/contacts.readonly")
			const res = await signInWithPopup(auth, provider)
			const user: UserInfo = {
				displayName: res.user.displayName!,
				uid: res.user.uid!,
				photoURL: res.user.photoURL!,
				email: res.user.email!,
			}

			await getDoc(doc(db, "users", user.uid)).then(async (res) => {
				if (!res.exists()) {
					await setDoc(doc(db, "users", user.uid), {
						uid: user.uid,
						displayName: user.displayName,
						email: user.email,
						photoURL: user.photoURL,
					})
				}
			})
			await getDoc(doc(db, "userChats", user.uid)).then(async (res) => {
				if (!res.exists()) {
					await setDoc(doc(db, "userChats", user.uid), {})
				}
			})
			dispatch(signIn(user))
			navigate("/")
		} catch (err: any) {
			console.log(err)
		}
	}

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setLogin((prev) => {
			return { ...prev, [e.target.name]: e.target.value }
		})
	}

	const handleSubmit = async (event: React.ChangeEvent<HTMLFormElement>) => {
		event.preventDefault()

		try {
			const res = await signInWithEmailAndPassword(
				auth,
				login.email,
				login.password
			)
			const user: UserInfo = {
				displayName: res.user.displayName!,
				uid: res.user.uid!,
				photoURL: res.user.photoURL!,
				email: res.user.email!,
			}
			dispatch(signIn(user))
			navigate("/")
		} catch (err: any) {
			let message = ""
			if (err.code == "auth/wrong-password") {
				message = "Wrong password"
			} else if (err.code == "auth/user-not-found") {
				message = "User not found"
			}
			setLogin((prev) => {
				return { ...prev, error: message }
			})
		}
	}
	return (
		<div className="form-container">
			<Toaster />
			<div className="form-wrapper">
				<span className="logo">Chat</span>
				<span className="title">Login</span>
				<form onSubmit={handleSubmit}>
					<input
						name="email"
						type="email"
						value={login.email}
						onChange={(e) => handleChange(e)}
						placeholder="Enter your e-mail..."
					/>
					<input
						name="password"
						type="password"
						value={login.password}
						onChange={(e) => handleChange(e)}
						placeholder="Enter your password..."
					/>
					{login.error && <div className="error__info">{login.error}</div>}
					<button type="submit">Sign in</button>
					<div className="sign-in">
						<p>Or sign in with</p>
						<FcGoogle
							onClick={handleSignInWithGoogle}
							className="sign-in__google"
						/>
					</div>
				</form>
				<p>
					Don't have an account? <Link to="/reg">Sign up</Link>
				</p>
			</div>
		</div>
	)
}

export default LoginPage
