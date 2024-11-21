import { faBars, faRobot, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import SideBar from "../components/SideBar";
import {
  addMessage,
  IData,
  IMessage,
  setNameChat,
} from "../store/chatSlice.ts";
import { useParams } from "react-router-dom";
import runGemini from "../gemini/index.ts";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/app.ts";

const ChatDetail = () => {
  const { id } = useParams();
  const [menuToggle, SetMenuToggle] = useState(false);
  const [dataDetail, setDataDetail] = useState<IData>();
  const [msgDetail, setMsgDetail] = useState<IMessage[]>([]);
  const [inputChat, setInputChat] = useState("");
  const { data } = useSelector((state: RootState) => state.chat);
  const dispatch = useDispatch();

  useEffect(() => {
    if (data.length > 0) {
      const chat = data.find((item) => item.id === id);
      console.log("chat", chat);
      if (chat) {
        setMsgDetail(chat.msg);
        setDataDetail(chat);
        setInputChat("");
      }
    }
  }, [data, id]);
  console.log("data", data);
  const handleChatDetail = async () => {
    if (id) {
      try {
        const chatText = await runGemini(inputChat, msgDetail);
        if (dataDetail?.title === "new chat") {
          const promptName = `This is a new chat, and user ask about ${inputChat}. No rely and comment just give me a name for this chat, Max length is 10 characters`;
          const newTitle = await runGemini(promptName);
          dispatch(setNameChat({ newTitle, chatId: id }));
        }
        if (chatText) {
          const dataMsg = {
            idChat: id,
            userMsg: inputChat,
            botMsg: chatText,
          };
          dispatch(addMessage(dataMsg));
        }
      } catch (error) {
        console.log("error", error);
      }
    }
  };

  return (
    <div className="text-white p-5 xl:w-[80%] w-full relative">
      <div className="flex gap-4 items-center">
        <button
          onClick={() => SetMenuToggle(!menuToggle)}
          className="xl:hidden"
        >
          <FontAwesomeIcon icon={faBars} />
        </button>
        <h1 className="text-3xl uppercase font-bold">Gemini</h1>
      </div>
      {menuToggle && (
        <div className="absolute h-full top-0 left-0 xl:hidden">
          <SideBar onToggle={() => SetMenuToggle(!menuToggle)} />
        </div>
      )}
      <div className="max-w-[70%] w-full mx-auto mt-10">
        {id ? (
          <div className="flex flex-col gap-7 h-[650px] overflow-x-hidden overflow-y-auto">
            {Array.isArray(msgDetail) &&
              msgDetail.map((item) => (
                <div className="flex gap-9" key={item.id}>
                  {item.isBot ? (
                    <>
                      <div className="w-10">
                        <FontAwesomeIcon icon={faRobot} size="2xl" />
                      </div>
                      <p dangerouslySetInnerHTML={{ __html: item.text }} />
                    </>
                  ) : (
                    <>
                      <div className="w-10">
                        <FontAwesomeIcon icon={faUser} size="2xl" />
                      </div>
                      <p>{item.text}</p>
                    </>
                  )}
                </div>
              ))}
          </div>
        ) : (
          <div className="flex flex-col">
            <div className="space-y-4">
              <h2 className="bg-gradient-to-r from-blue-700 via-green-700 to-indigo-900 inline-block text-transparent bg-clip-text text-4xl font-bold">
                Xin Chào
              </h2>
              <p className="text-xl">Hôm nay tôi có thể giúp gì cho bạn?</p>
            </div>
            <div className="flex gap-2 items-center mt-4">
              <div className="flex justify-center items-center rounded bg-slate-600 p-11">
                Lên kế hoạch bữa ăn
              </div>
              <div className="flex justify-center items-center rounded bg-slate-600 p-11">
                Lên kế hoạch bữa ăn
              </div>
              <div className="flex justify-center items-center rounded bg-slate-600 p-11">
                Lên kế hoạch bữa ăn
              </div>
              <div className="flex justify-center items-center rounded bg-slate-600 p-11">
                Lên kế hoạch bữa ăn
              </div>
            </div>
          </div>
        )}
        <div className="flex items-center justify-center mt-9 gap-4">
          <input
            type="text"
            placeholder="Nhập câu lệnh tại đây"
            className="p-4 rounded bg-primaryBg-default border w-[100%]"
            onChange={(e) => {
              setInputChat(e.target.value);
            }}
            value={inputChat}
          />
          <button
            onClick={handleChatDetail}
            className="p-4 rounded bg-green-800"
          >
            Gửi
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatDetail;
