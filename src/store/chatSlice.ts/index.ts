import { text } from "@fortawesome/fontawesome-svg-core";
import { createSlice } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from "uuid";
import { marked } from "marked";
import DOMPurify from "dompurify";

export interface IMessage {
  id: string;
  text: string;
  isBot: boolean;
}

export interface IData {
  id: string;
  title: string;
  msg: IMessage[];
}

export interface IInitData {
  data: IData[];
}

const initData: IInitData = {
  data: [],
};

const chatSlice = createSlice({
  name: "chat",
  initialState: initData,
  reducers: {
    addChat: (state) => {
      state.data.push({
        id: uuidv4(),
        title: "new chat",
        msg: [],
      });
    },
    addMessage: (state, action) => {
      const { idChat, userMsg, botMsg } = action.payload;
      const chat = state.data.find((item) => item.id === idChat);
      if (chat) {
        const msgFormat = marked.parse(botMsg);
        const safeChat = DOMPurify.sanitize(msgFormat as string);
        const newMsg = [
          ...chat.msg,
          { id: uuidv4(), text: userMsg, isBot: false },
          { id: uuidv4(), text: safeChat, isBot: true },
        ];
        chat.msg = newMsg;
        state.data = [...state.data];
      }
    },
    deleteChat: (state, action) => {
      state.data = state.data.filter((item) => item.id !== action.payload);
    },
    setNameChat: (state, action) => {
      const { newTitle, chatId } = action.payload;
      const chat = state.data.find((item) => item?.id === chatId);
      if (chat) {
        chat.title = newTitle;
      }
    },
  },
});

export const { addChat, deleteChat, addMessage, setNameChat } =
  chatSlice.actions;

export default chatSlice.reducer;
