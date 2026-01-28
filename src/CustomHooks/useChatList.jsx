// useChatUserList.js

import { useEffect, useState } from "react";
import { useCollection } from "react-firebase-hooks/firestore";
import { store as firestore } from "../firebase";
import { collection, query, where, orderBy } from "firebase/firestore";

const useChatList = (currentUserUid, tab) => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const usersRef = collection(
        firestore,
        tab === "1" ? "internal_chats" : "client_chats"
    );
    // Query users where the user array contains the current user's UID
    const ans = query(
        usersRef,
        where("users", "array-contains", currentUserUid)
    );
    const [snapshot, error] = useCollection(ans);
    useEffect(() => {
        if (snapshot) {
            const userList = snapshot.docs.map((doc) => {
                const data = doc.data();
                const unread = data.unread_count[currentUserUid];
                const user = data.users.filter(
                    (user) => user !== currentUserUid
                )[0];
                const name = data.user_details[user].name;
                const uid = doc.id;
                return { name, unread, uid, user };
            });
            setUsers(userList);
            setLoading(false);
        }

        if (error) {
            console.error("Error fetching chat user list:", error);
            setLoading(false);
        }
    }, [snapshot, error]);

    return { users, loading };
};

export default useChatList;
