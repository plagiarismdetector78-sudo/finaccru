import { collection, query, onSnapshot, limit, getDocs } from 'firebase/firestore';
import { aiChatStore } from '../firebaseAIChat';

/**
 * Listen for all messages (user + AI) in real-time
 * @param {string} userId - Firebase user ID
 * @param {function} onNewMessage - Callback when new message arrives
 * @returns {function} Unsubscribe function
 */
export const listenToAIResponses = (userId, onNewMessage) => {
  if (!userId) {
    return () => {};
  }

  const messagesRef = collection(aiChatStore, `chat-responses/${userId}/messages`);
  // Get all messages (will be sorted by timestamp in snapshot processing)
  const q = query(messagesRef);

  let isFirstSnapshot = true;

  const unsubscribe = onSnapshot(
    q,
    (snapshot) => {
      // For first snapshot, sort all messages by timestamp
      if (isFirstSnapshot) {
        const allMessages = [];
        
        snapshot.forEach((doc) => {
          const data = doc.data();
          
          // Skip messages with null/empty content
          if (!data.content) {
            return;
          }
          
          if (data.type === 'user' || (data.type === 'ai' && data.status === 'completed')) {
            // Convert Firestore Timestamp to ISO string
            let timestamp;
            if (data.timestamp?.toDate) {
              timestamp = data.timestamp.toDate().toISOString();
            } else if (data.timestamp?.seconds) {
              timestamp = new Date(data.timestamp.seconds * 1000).toISOString();
            } else {
              timestamp = data.timestamp || new Date().toISOString();
            }
            
            allMessages.push({
              id: doc.id,
              type: data.type,
              content: data.content,
              timestamp: timestamp,
              status: data.status,
              actionCards: data.action_cards || []
            });
          }
        });

        // Sort by timestamp (oldest first)
        allMessages.sort((a, b) => {
          // Handle Firestore Timestamp objects
          let timeA, timeB;
          
          if (a.timestamp?.seconds) {
            timeA = a.timestamp.seconds * 1000;
          } else {
            timeA = new Date(a.timestamp).getTime();
          }
          
          if (b.timestamp?.seconds) {
            timeB = b.timestamp.seconds * 1000;
          } else {
            timeB = new Date(b.timestamp).getTime();
          }
          
          return timeA - timeB; // Ascending (oldest first)
        });
        
        // Dispatch all messages in order
        allMessages.forEach(message => {
          onNewMessage(message);
        });

        isFirstSnapshot = false;
      } else {
        // For subsequent snapshots, only process new 'added' messages
        snapshot.docChanges().forEach((change) => {
          if (change.type === 'added') {
            const data = change.doc.data();
            const docId = change.doc.id;

            // Skip messages with null/empty content
            if (!data.content) {
              return;
            }

            if (data.type === 'user' || (data.type === 'ai' && data.status === 'completed')) {
              // Convert Firestore Timestamp to ISO string
              let timestamp;
              if (data.timestamp?.toDate) {
                timestamp = data.timestamp.toDate().toISOString();
              } else if (data.timestamp?.seconds) {
                timestamp = new Date(data.timestamp.seconds * 1000).toISOString();
              } else {
                timestamp = data.timestamp || new Date().toISOString();
              }
              
              const message = {
                id: docId,
                type: data.type,
                content: data.content,
                timestamp: timestamp,
                status: data.status,
                actionCards: data.action_cards || []
              };

              onNewMessage(message);
            }
          }
        });
      }
    },
    (error) => {
      // Error handled silently
    }
  );

  return unsubscribe;
};

/**
 * Fetch chat history once (for loading previous messages)
 * @param {string} userId - Firebase user ID
 * @param {number} limitCount - Number of messages to fetch
 * @returns {Promise<Array>} Array of messages
 */
export const fetchChatHistory = async (userId, limitCount = 100) => {
  if (!userId) {
    return [];
  }

  try {
    const messagesRef = collection(aiChatStore, `chat-responses/${userId}/messages`);
    const q = query(messagesRef, limit(limitCount));

    const snapshot = await getDocs(q);
    
    const messages = snapshot.docs
      .map(doc => ({
        id: doc.id,
        type: doc.data().type,
        content: doc.data().content,
        timestamp: doc.data().timestamp || doc.data().createTime,
        status: doc.data().status,
        actionCards: doc.data().action_cards || []
      }))
      .sort((a, b) => {
        // Sort by timestamp (oldest first)
        const timeA = new Date(a.timestamp).getTime();
        const timeB = new Date(b.timestamp).getTime();
        return timeA - timeB;
      });

    return messages;
  } catch (error) {
    return [];
  }
};

