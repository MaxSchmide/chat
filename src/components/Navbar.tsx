import { signOut } from "firebase/auth"
import { useSelector } from "react-redux"
import { auth } from "../firebase"
import { RootState, logOut, useAppDispatch } from "../store"

const Navbar = () => {
	const { currentUser } = useSelector((state: RootState) => state.chat)
	const dispatch = useAppDispatch()
	const handleLogout = () => {
		signOut(auth)
		dispatch(logOut())
	}
	return (
		<div className="navbar">
			<span className="logo">Chat</span>
			<div className="user">
				<img src={currentUser?.photoURL} alt="logo" />
				<span>{currentUser?.displayName.split(" ")[0]}</span>
				<button onClick={handleLogout}>Log out</button>
			</div>
		</div>
	)
}

export default Navbar
