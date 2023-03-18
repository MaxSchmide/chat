import Chat from "../components/Chat"
import Sidebar from "../components/Sidebar"

const HomePage = () => {
	return (
		<div className="home">
			<div className="home__container">
				<Sidebar />
				<Chat />
			</div>
		</div>
	)
}

export default HomePage
