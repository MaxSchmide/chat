import { Toaster } from "react-hot-toast"
import { RouterProvider, createBrowserRouter } from "react-router-dom"
import HomePage from "./pages/HomePage"
import LoginPage from "./pages/LoginPage"
import RegisterPage from "./pages/RegisterPage"
import PrivateRoute from "./routes/PrivateRoute"

const router = createBrowserRouter([
	{
		path: "/",
		element: (
			<PrivateRoute>
				<HomePage />
			</PrivateRoute>
		),
	},
	{
		path: "/login",
		element: <LoginPage />,
	},
	{
		path: "/reg",
		element: <RegisterPage />,
	},
])

const App = () => {
	return (
		<>
			<Toaster />
			<RouterProvider router={router} />
		</>
	)
}

export default App
