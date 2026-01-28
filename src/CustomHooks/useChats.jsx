// useChatUserList.js

import { useEffect, useState } from "react";
import { useCollection } from "react-firebase-hooks/firestore";
import { store as firestore } from "../firebase";
import { collection, query, where, orderBy } from "firebase/firestore";

const useChats = (id, tab) => {
    const [chats, setChats] = useState([]);
    const [loading, setLoading] = useState(true);
    // fetch collection if tab is 1 then fetch internal_chats/id/messages else fetch client_chats/id/messages
    const usersRef = collection(
        firestore,
        tab === "1"
            ? `internal_chats/${id}/messages`
            : `client_chats/${id}/messages`
    );
    // Query users where the user array contains the current user's UID
    const ans = query(usersRef, orderBy("createdAt"));
    const [snapshot, error] = useCollection(ans);
    useEffect(() => {
        if (snapshot) {
            const userList = snapshot.docs.map((doc) => {
                const document = doc.data()?.document;
                const seconds = doc.data().createdAt.seconds;
                const nanoseconds = doc.data().createdAt.nanoseconds;
                const data = doc.data();
                const time = new Date(seconds * 1e3 + nanoseconds / 1e6);
                const message = data.text;
                const from = data.from;
                const uid = doc.id;
                return { data, uid, time, message, from, document };
            });
            setChats(userList);
            setLoading(false);
        }

        if (error) {
            console.error("Error fetching chat user list:", error);
            setLoading(false);
        }
    }, [snapshot, error]);

    return { chats, loading };
};

export default useChats;
