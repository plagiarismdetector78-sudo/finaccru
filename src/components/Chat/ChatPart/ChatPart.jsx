import { useDispatch, useSelector } from "react-redux";

import { markMessageAsRead, sendChatMessage } from "../../../Actions/Chat";
import useChats from "../../../CustomHooks/useChats";

import "./ChatPart.css";
import { LinkOutlined, SendOutlined, LoadingOutlined, WechatOutlined } from "@ant-design/icons";
import { useEffect, useRef, useState } from "react";

const ChatPart = ({ chatId, tab, user, users }) => {

    const dispatch = useDispatch()

    const { user: userDetails } = useSelector(state => state.userReducer);
    const { loading: chatLoading, open, document } = useSelector(state => state.chatReducer);

    // Get chats
    const { chats, loading } = useChats(chatId, tab);
    const [text, setText] = useState("");
    const [file, setFile] = useState(null);

    // Send message
    const handleSubmit = (e) => {
        e.preventDefault();
        let data = {
            receiver_id: user?.user,
            text: text,
            document: document,
        }
        if (!user?.uid.includes("@FIX")) {
            data.chat_id = user?.uid;
        }
        dispatch(sendChatMessage(data, userDetails?.localInfo?.role, tab, chatId));
        setText("");
    }


    // Auto scroll to bottom
    const messagesEndRef = useRef(null)
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }
    useEffect(() => {
        scrollToBottom()
    }, [chats, open, messagesEndRef,chatId, user?.name])


    useEffect(() => {
        if (chatId) {
            dispatch({ type: "OpenChatModal" });
        } else {
            dispatch({ type: "CloseChatModal" });
        }
        return () => {
            dispatch({ type: "CloseChatModal" });
        }
    }, [chatId])


    // Mark as read
    useEffect(() => {
        if ((chats?.length > 0) && ((userDetails?.localInfo?.role !== 0) || (open))) {
            dispatch(markMessageAsRead(userDetails?.localInfo?.role, tab, chatId));
        }
    }, [chats, users]);


    return (
        <div className="chat-section">
            {
                user?.name ?
                    <>
                        <div className="chatPart--header">{user?.name}</div>
                        <div className="chatPart--chats">
                            {
                                chats?.map((message, index) => {
                                    return (
                                        <div className={`chatPart--chat ${message.from === user?.user ? "receivedChat" : "sentChat"}`} key={index}>
                                            <div className="chatPart--chatMessage">
                                                {message.message}
                                            </div>
                                            <div className="chatPart--chatInfo">
                                                <div className="chatPart--chatTime">
                                                    {
                                                        message?.time.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
                                                    } | {
                                                        message?.time.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })
                                                    }
                                                </div>
                                                {
                                                    message?.document && userDetails?.localInfo?.role !== 0 &&
                                                    <a href={
                                                        `/clients/${message?.from}` +
                                                        `${message?.document?.number.startsWith("EST") ? `/estimate/view/${message?.document?.id}`
                                                            : message?.document?.number.startsWith("PI") ? `/proforma/view/${message?.document?.id}`
                                                                : message?.document?.number.startsWith("INV") ? `/tax-invoice/view/${message?.document?.id}`
                                                                    : message?.document?.number.startsWith("CN") ? `/credit-note/view/${message?.document?.id}`
                                                                        : message?.document?.number.startsWith("RC") ? `/payment/view/${message?.document?.id}`
                                                                            : message?.document?.number.startsWith("PO") ? `/purchase-order/view/${message?.document?.id}`
                                                                                : message?.document?.number.startsWith("BILL") ? `/bill/view/${message?.document?.id}`
                                                                                    : message?.document?.number.startsWith("BP") ? `/bill-payment/view/${message?.document?.id}`
                                                                                        : message?.document?.number.startsWith("DN") ? `/debit-note/view/${message?.document?.id}`
                                                                                            : null}`
                                                    } rel="noreferrer" className="chatPart--chatDocNumber">
                                                        {message?.document?.number}
                                                    </a>
                                                }
                                            </div>
                                        </div>
                                    )
                                })
                            }
                            <div ref={messagesEndRef} />
                        </div>
                        <form className="chatPart--input">
                            <label htmlFor="file"><LinkOutlined /></label>
                            <input type="file" name="file" id="file" hidden onChange={(e) => setFile(e.target.files[0])} />
                            <input type="text" placeholder="Type a message" value={text} onChange={(e) => setText(e.target.value)} disabled={chatLoading} />
                            <button type="submit" onClick={handleSubmit} disabled={chatLoading}>
                                {chatLoading ? <LoadingOutlined /> : <SendOutlined />}
                            </button>
                        </form>
                        {document !== null &&
                            <div className="chatPart--document" style={{ display: "flex", alignItems: "center" }}>
                                <div className="chatPart--document--close" onClick={() => dispatch({ type: "RemoveChatDocument" })}>X</div>
                                <div>
                                    <span style={{ fontWeight: "bold" }}>Document: {document?.number}</span>
                                </div>

                            </div>
                        }
                        
                    </> :
                    <div className="empty__chatBlock">
                        <WechatOutlined style={{ fontSize: "3rem" }} />
                        <div className="empty__chatBlock--text">
                            Start a chat now!
                        </div>
                    </div>
            }
        </div>
    )
}

export default ChatPart;
