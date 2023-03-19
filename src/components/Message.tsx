import moment from "moment"
import { useEffect, useRef } from "react"
import { useSelector } from "react-redux"
import { IMessage } from "../models/main.model"
import { RootState } from "../store"

type Props = {
	message?: IMessage
}

const Message = ({ message }: Props) => {
	const ref = useRef<HTMLDivElement>(null)

	const { currentUser, chatUser } = useSelector(
		(state: RootState) => state.user
	)

	const timestamp = message?.date

	const date = moment
		.unix(timestamp)
		.add(message?.date.nanoseconds / 1000000, "milliseconds")
	const Fordate = date.format("LT")

	useEffect(() => {
		ref.current!.scrollIntoView({
			behavior: "smooth",
		})
	}, [message])

	return (
		<div
			ref={ref}
			className={`message ${message?.senderId === currentUser?.uid && "owner"}`}
		>
			<div className="message__info">
				<img
					src={
						message?.senderId === currentUser?.uid
							? currentUser?.photoURL!
							: chatUser?.photoURL
					}
					alt=""
				/>
				<span>{Fordate}</span>
			</div>
			<div className="message__content">
				{message?.text && <p>{message?.text}</p>}
				{message?.img && (
					<>
						<a href={message.img} target="_blank">
							<img src={message?.img} alt="" />
						</a>
					</>
				)}
			</div>
		</div>
	)
}

export default Message
