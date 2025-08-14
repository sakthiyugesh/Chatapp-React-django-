import React, { useEffect, useState } from "react";
// import { Link } from "react-router-dom";

// import ChatSection from "./ChatSection";
import { Link, Links } from "react-router-dom";
import Profile from "../assets/Images/cool-profile-picture-87h46gcobjl5e4xu.jpg";
import axios from "axios";
import OTPLogin from "../pages/OTPLogin";
import { jwtDecode } from "jwt-decode";
import Fuse from "fuse.js";

const HomeUi = () => {
  // let [username, setUsername] = useState("");
  let [chatInbox, setChatInbox] = useState([]);
  let [userlist, setUserList] = useState([]);
  const [newMessage, setNewMessages] = useState([]);

  const [loading, setLoading] = useState(true);
  const [searchUser, setSearchUser] = useState("");

  const UserData = localStorage.getItem("access");
  let [user, setUser] = useState(
    UserData ? jwtDecode(UserData) : "No user Found"
  );

  useEffect(() => {
    userList();
    // console.log(user);
  }, []);

  useEffect(() => {
    if (user) {
      ChatInbox();
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      const ws = new WebSocket(
        `ws://127.0.0.1:8000/ws/chat/inbox/${user.user_id}/`
      );

      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        setNewMessages((prevMessages) => {
          const isDuplicate = prevMessages.some((msg) => msg.id === data.id);
          return isDuplicate ? prevMessages : [...prevMessages, data];
        });
      };

      ws.onopen = () => console.log("WebSocket connection established");
      ws.onerror = (error) => console.error("WebSocket error:", error);

      return () => ws.close();
    }
  }, [user]);

  const allMessages = [...chatInbox, ...newMessage];

  const latestMessages = Object.values(
    allMessages.reduce((acc, message) => {
      const contactKey =
        message.sender === user.user_id ? message.receiver : message.sender;

      if (
        !acc[contactKey] ||
        new Date(message.date_time) > new Date(acc[contactKey].date_time)
      ) {
        acc[contactKey] = message;
      }
      return acc;
    }, {})
  );

  const sortedMessages = latestMessages.sort(
    (a, b) => new Date(b.date_time) - new Date(a.date_time)
  );

  const ChatInbox = async () => {
    try {
      const res = await axios.get(
        `http://127.0.0.1:8000/api/chatinbox/${user.user_id}/`
      );
      setChatInbox(res.data);
      // console.log(res.data)
    } catch (err) {
      console.error("Error fetching user list:", err);
    }
  };

  let userList = async () => {
    let res = await axios.get("http://127.0.0.1:8000/api/user-lists/");
    setUserList(res.data);
  };

  let localtime = (datetime) => {
    return new Date(datetime).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const fuse = new Fuse(userlist, {
    keys: ["username", "email"], // Fields to search
    threshold: 0.4, // Adjust for more/less fuzziness
  });

  const filteredUsers = searchUser
    ? fuse.search(searchUser).map((result) => result.item)
    : userlist.filter((u) => u.id !== user.user_id);

  return (
    <>
      {user ? (
        <div className="container">
          <span className="bottom_menu">
            <i class="fa-solid fa-circle-notch"></i>
          </span>
          <div className="header">
            <div className="heading">
              <p>Hi,</p>
              <h4>{user.username}</h4>
              {/* <h4>{user.user_id}</h4> */}
            </div>
            <div className="bars">
              <Link to={'/search'}>
                <i class="fa-solid fa-magnifying-glass"></i>
              </Link>
              <i class="fa-solid fa-ellipsis-vertical"></i>
            </div>
          </div>
          <div className="sub_header">
            <ul>
              <li>chats</li>
              <li className="active">Chats</li>
              <li>Calls</li>
              <li>Groups</li>
            </ul>
          </div>
          <div className="m-top">
            {latestMessages.map((msg) => (
              <Link
                to={`/chat/${msg.id}/${msg.sender}/${msg.receiver}/${user.user_id}`}
                className="section"
              >
                <div className="chat_section">
                  <div className="chats">
                    <img src={Profile} alt="" />
                    <div className="chat_content">
                      {userlist
                        .filter(
                          (u_id) =>
                            u_id.id ==
                            (msg.sender == user.user_id
                              ? msg.receiver
                              : msg.sender)
                        )
                        .map((user) => (
                          <h4>{user.username}</h4>
                        ))}

                      <p>{msg.chat}</p>
                    </div>
                  </div>
                  <div className="timezone">
                    <p>{localtime(msg.date_time)}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      ) : (
        <OTPLogin />
      )}
    </>
  );
};

export default HomeUi;
