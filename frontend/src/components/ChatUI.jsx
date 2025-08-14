import React, { useEffect, useState } from "react";

import Profile from "../assets/Images/cool-profile-picture-87h46gcobjl5e4xu.jpg";
import { Link } from "react-router-dom";

import axios from "axios";

import { useParams } from "react-router-dom";

const ChatUI = () => {
  const { id, sender, receiver, userid } = useParams();
  let [message, setMessage] = useState([]);
  let [userlist, setUserList] = useState([]);
  let [inputMsg, setInputmsg] = useState(null);

  const [socket, setSocket] = useState(null);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    // console.log(inputMsg);
    fetchData();
    userList();
    console.log("Chat ID:", id, sender, receiver);
  }, []);
  // }, [message]);

  useEffect(() => {
    // console.log(message);
    const ws = new WebSocket(
      `ws://127.0.0.1:8000/ws/chat/${sender}/${receiver}/`
    );
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setMessage((prev) => [...prev, data]);
    };

    ws.onopen = () => {
      console.log("Connection success!");
    };

    setSocket(ws);
    return () => ws.close();
  }, [sender, receiver]);

  const fetchData = async () => {
    let response = await axios.get("http://127.0.0.1:8000/api/message-lists/");
    // console.log(response.data);
    setMessage(response.data);
  };

  let userList = async () => {
    let res = await axios.get("http://127.0.0.1:8000/api/user-lists/");
    setUserList(res.data);
  };

  let sendMessage = async (e) => {
    e.preventDefault();
    // console.log("click");
    // let res = await axios.post("http://127.0.0.1:8000/api/sent-message/", {
    //   sender: userid,
    //   receiver: receiver == userid ? sender : receiver,
    //   chat: inputMsg,
    // });
    if (socket && inputMsg.trim()) {
      const messageData = {
        sender: userid,
        receiver: receiver == userid ? sender : receiver,
        chat: inputMsg,
      };
      socket.send(JSON.stringify(messageData));
      // setNewMessage("");
      setInputmsg("");
    }
  };

  return (
    <div class="chat-container">
      <div class="chat-header">
        <Link to={"/"}>
          <i className="fa-solid fa-arrow-left"></i>
        </Link>
        <img src={Profile} alt="User" />
        {userlist
          .filter(
            (user) =>
              user.id ===
              (parseInt(userid) === parseInt(sender)
                ? parseInt(receiver)
                : parseInt(sender))
          )
          .map((user) => (
            <h4 key={user.id}>{user.username}</h4>
          ))}
      </div>
      {message
        .filter(
          (msg) =>
            (parseInt(msg.sender) === parseInt(sender) &&
              parseInt(msg.receiver) === parseInt(receiver)) ||
            (parseInt(msg.sender) === parseInt(receiver) &&
              parseInt(msg.receiver) === parseInt(sender))
        )
        .map((msg) => (
          <div
            key={msg.id}
            className={`message ${
              parseInt(msg.sender) === parseInt(userid) ? "sent" : "received"
            }`}
          >
            {msg.chat}
          </div>
        ))}

      <div class="chat-input">
        <input
          type="text"
          value={inputMsg}
          onChange={(e) => {
            setInputmsg(e.target.value);
          }}
          placeholder="Ok. Let me check"
        />
        <button onClick={sendMessage}>➤</button>
      </div>
    </div>
  );
};

export default ChatUI;
