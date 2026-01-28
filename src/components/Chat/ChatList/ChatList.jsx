import { useEffect, useState } from "react";
import "./ChatList.css";
import { readAccountantClientsList, readJrAccountants } from "../../../Actions/Accountant";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";

const ChatList = ({ chatList, loading, setChatId, chatId, setChatItem, tab, chatUser, setChatUser }) => {
    const { user } = useSelector(state => state.userReducer);
    const { clients, jr_accountants, loading: clientLoading } = useSelector((state) => state.accountantReducer);
    const { open } = useSelector(state => state.chatReducer);
    const [appendedChatList, setAppendedChatList] = useState(chatList);

    const dispatch = useDispatch();

    // Accountant Clients List
    useEffect(() => {
        if (tab === "2" && user?.localInfo?.role === 1)
            dispatch(readAccountantClientsList());
        if (tab === "1" && user?.localInfo?.role === 2)
           dispatch(readJrAccountants());
        if (tab === "1")
            setAppendedChatList(chatList);

    }, [dispatch, chatList]);

    const [searchParams, setSearchParams] = useSearchParams();
    const id = searchParams.get("id");
    useEffect(() => {
        if (chatUser) return;
        setChatId(id);
        setChatItem(chatList?.find((chat) => chat.uid === id));
        setChatUser(chatList?.find((chat) => chat.uid === id)?.user);
    }, [id, clients, chatList.length]);

    // Appending Clients List to Chat List to get clients with no chat history
    useEffect(() => {
        if (tab === "2" && user?.localInfo?.role === 1) {
            const newChatList = clients?.map((client) => {
                const chat = chatList?.find((chat) => chat.uid === client.client_id);
                if (chat) {
                    return chat;
                } else {
                    return {
                        uid: client.client_id,
                        user: client.client_id,
                        name: client.company_name,
                        unread: 0,
                    };
                }
            });
            setAppendedChatList(newChatList);
        }
        if (tab === "1" && user?.localInfo?.role === 2) {
            let clientList = [];
            let jrs = jr_accountants?.map((client) => {
                const chat = chatList?.find((chat) => chat.user === client.accountant_id);
                clientList.push(client.accountant_id);
                if (chat) {
                    return chat;
                } else {
                    return {
                        uid: client.accountant_id + user?.localId + "@" + "FIX",
                        user: client.accountant_id,
                        name: client.accountant_name,
                        unread: 0,
                    };
                }
            });
            const nonChat = chatList?.filter((chat) => !clientList.includes(chat.user));
            setAppendedChatList(jrs?.concat(nonChat));
        }
    }, [clients,jr_accountants, chatList]);

    useEffect(() => {
        setChatId(appendedChatList?.find((chat) => chat.user === chatUser)?.uid);
        setChatItem(appendedChatList?.find((chat) => chat.user === chatUser));
    }, [chatUser, appendedChatList]);

    return (
        loading ? <div>Loading...</div> :
            <div className="chatList--main">
                {
                    appendedChatList?.map((chat) => (
                        <div
                            className={`chatList--item ${(chatId === chat?.uid) || (chatUser === chat?.user) ? "active" : ""}`}
                            key={chat?.uid}
                            onClick={() => { setChatUser(chat?.user) }}
                        >
                            <div className="chatList--item__left">
                                <span>{chat.name}</span>
                            </div>
                            {
                                (chat.unread > 0 && !open) &&
                                <div className="chatList--item__right">
                                    <span>{chat.unread}</span>
                                </div>
                            }
                        </div>
                    ))
                }
            </div>
    )
}

export default ChatList;
