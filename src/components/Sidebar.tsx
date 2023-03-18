import React from "react"
import Navbar from "./Navbar"
import Search from "./Search"
import ChatsList from "./ChatsList"

const Sidebar = () => {
	return (
		<div className="sidebar">
			<Navbar />
			<Search />
			<ChatsList />
		</div>
	)
}

export default Sidebar
