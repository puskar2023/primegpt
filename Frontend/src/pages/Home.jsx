import Sidebar from "../components/Sidebar";
import ChatWindow from "../components/ChatWindow";
import SettingsPanel from "../components/SettingsPanel";
import "../styles/primegpt.css";

const Home = () => {
  return (
    <div className="primegpt-container">
      <Sidebar />
      <ChatWindow />
      <SettingsPanel />
    </div>
  );
};

export default Home;
