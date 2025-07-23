// utils/chatUtils.js

let typingTimer = null; // Shared timer for typing debounce

// debounce typing timeout
export function startTypingTimeout(socket, chatId, setTyping, timeout = 3000) {
  if (typingTimer) clearTimeout(typingTimer);

  typingTimer = setTimeout(() => {
    socket.emit("stop typing", chatId);
    setTyping(false);
  }, timeout);
}

// setup socket listeners for incoming messages and typing
export function setupSocketListeners(socket, selectedChat, {
  onNewMessage,
  onTypingStart,
  onTypingStop
}) {
  const handleMessage = (newMsg) => {
    if (
      selectedChat &&
      newMsg.chat &&
      newMsg.chat._id?.toString() === selectedChat._id?.toString()
    ) {
      console.log("New message received:", newMsg);
      onNewMessage(newMsg);
    }
  };

  socket.on("message received", handleMessage);
  socket.on("typing", onTypingStart);
  socket.on("stop typing", onTypingStop);

  return () => {
    socket.off("message received", handleMessage);
    socket.off("typing", onTypingStart);
    socket.off("stop typing", onTypingStop);
  };
}

// scroll to bottom
export function scrollToBottom(ref) {
  ref?.current?.scrollIntoView({ behavior: "smooth" });
}

// preserve scroll when loading older messages
export function preserveScrollOnPrepend(containerRef, callback) {
  const prevHeight = containerRef.current.scrollHeight;
  callback();
  requestAnimationFrame(() => {
    const newHeight = containerRef.current.scrollHeight;
    containerRef.current.scrollTop += newHeight - prevHeight;
  });
}

// check if message is from current user
export function isOwnMessage(message, currentUserId) {
  return message.sender._id === currentUserId;
}
