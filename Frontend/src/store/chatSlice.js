import { createSlice } from "@reduxjs/toolkit";


const initialState = {
  chats: [],
  currentChatId: null,
  showSettings: false,
  sidebarVisible: false,
};

const truncate = (s, n = 50) => (s.length > n ? s.substring(0, n) + "..." : s);

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    loadChats(state, action) {
      state.chats = action.payload || [];
      state.currentChatId = state.chats[0]?._id || null;
    },
    createChat(state, action) {
      const title = action.payload?.title || "";
      const _id = action.payload?._id || Date.now().toString();
      const chat = { _id, title, messages: [] };
      state.chats = [chat, ...state.chats];
      state.currentChatId = _id;
    },
    deleteChat(state, action) {
      const id = action.payload;
      state.chats = state.chats.filter((c) => c.id !== id);
      if (state.currentChatId === id)
        state.currentChatId = state.chats[0]?.id || null;
    },
    selectChat(state, action) {
      state.currentChatId = action.payload;
    },
    addMessage(state, action) {
      const { chatId, message } = action.payload;
      const idx = state.chats.findIndex((c) => c.id === chatId);
      if (idx === -1) return;
      const chat = state.chats[idx];
      const wasEmpty = !chat.messages || chat.messages.length === 0;
      const newMessages = [...chat.messages, message];
      const newTitle =
        wasEmpty && message.role === "user" && !chat.title
          ? truncate(message.text || "")
          : chat.title;
      const updated = { ...chat, title: newTitle, messages: newMessages };
      state.chats = [
        ...state.chats.slice(0, idx),
        updated,
        ...state.chats.slice(idx + 1),
      ];
    },
    addMessagesBatch(state, action) {
      const { chatId, messages } = action.payload;
      const idx = state.chats.findIndex((c) => c._id === chatId);
      if (idx === -1) return;
      const chat = state.chats[idx];
      const wasEmpty = !chat.messages || chat.messages.length === 0;
      let updated = null;
      if (wasEmpty) {
        updated = {
        ...chat,
        messages: [...messages]
      }
      }else{
        updated = {
        ...chat,
        messages: [...chat.messages, ...messages]
      }
      }
      
      state.chats = [
        ...state.chats.slice(0, idx),
        updated,
        ...state.chats.slice(idx + 1),
      ];
    },
    updateBotMessage(state, action) {
      const { chatId, botId, text } = action.payload;
      state.chats = state.chats.map((c) => {
        if (c._id !== chatId) return c;
        const msgs = c.messages.map((m) =>
          m.id === botId ? { ...m, text } : m,
        );
        return { ...c, messages: msgs };
      });
    },
    setShowSettings(state, action) {
      state.showSettings = !!action.payload;
    },
    setSidebarVisible(state, action) {
      state.sidebarVisible = !!action.payload;
    },
  },
});

export const {
  loadChats,
  createChat,
  deleteChat,
  selectChat,
  addMessage,
  addMessagesBatch,
  updateBotMessage,
  setShowSettings,
  setSidebarVisible,
  getState,
} = chatSlice.actions;

export default chatSlice.reducer;

// Thunk-style action creator for sending a message (keeps existing behavior)
