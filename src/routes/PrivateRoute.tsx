import { useSelector } from "react-redux"
import { Navigate } from "react-router-dom"
import { RootState } from "../store"
type Props = {
	children: React.ReactNode
}

const PrivateRoute = ({ children }: Props) => {
	const { currentUser } = useSelector((state: RootState) => state.user)
	return <>{currentUser ? children : <Navigate to="/login" />}</>
}

export default PrivateRoute
