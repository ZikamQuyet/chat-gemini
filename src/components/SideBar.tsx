import {
  faBars,
  faCommentDots,
  faPlus,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/app";
import { addChat, deleteChat } from "../store/chatSlice.ts";
import { Link, useNavigate } from "react-router-dom";

interface IPropsSideBar {
  onToggle?: () => void;
}

const SideBar = (props: IPropsSideBar) => {
  const { onToggle } = props;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { data } = useSelector((state: RootState) => state.chat);

  const handleAddChat = () => {
    dispatch(addChat());
  };
  const handleDeleteChat = (id: string) => {
    dispatch(deleteChat(id));
    navigate("/");
  };
  console.log("data", data);
  return (
    <div className="bg-primaryBg-sideBar w-[280px] h-screen text-white p-4">
      <button className="flex ml-auto xl:hidden" onClick={onToggle}>
        <FontAwesomeIcon icon={faBars} />
      </button>
      <div className="mt-20 mb-10 flex justify-center">
        <button
          className="px-4 py-1 rounded flex items-center space-x-4 bg-slate-700"
          onClick={handleAddChat}
        >
          <FontAwesomeIcon icon={faPlus} />
          <p>Cuộc trò chuyện mới</p>
        </button>
      </div>
      <p>Gần đây:</p>
      {/* list chat */}
      <div className="mt-3 flex flex-col gap-2">
        {/* chat item */}
        {data.map((item) => (
          <Link
            to={`/chat/${item.id}`}
            key={item.id}
            className="flex items-center px-4 py-2 bg-blue-950 rounded justify-between"
          >
            <div className="flex items-center gap-3">
              <FontAwesomeIcon icon={faCommentDots} />
              <p>{item.title}</p>
            </div>
            <button
              onClick={(e) => {
                e.preventDefault();
                handleDeleteChat(item.id);
              }}
            >
              <FontAwesomeIcon icon={faTrash} />
            </button>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default SideBar;
