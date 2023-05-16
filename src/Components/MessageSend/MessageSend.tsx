import { Link, useNavigate } from "react-router-dom";
import "./MessageSend.scss";
import { useState } from "react";

interface Message {
  message: string;
  my: boolean;
}

const MessageSend = () => {
  const navigate = useNavigate();
  const [logIn, setLogIn] = useState(false);
  const [allMessage, setAllMessage] = useState<Message[]>([]);
  const [idInstance, setIdInstance] = useState(
    ""
    // "1101820565"
  );
  const [apiTokenInstance, setApiTokenInstance] = useState(
    ""
    // "ff1b1d87e69d40d2a91f520ed9d2085a6fbc79cc00f4470ead"
  );
  const handleMessage = async (e: any) => {
    e.preventDefault();

    const message = e?.target?.message?.value;
    const chatId = `${e?.target?.phoneNumber?.value}@c.us`;

    await fetch(
      `https://api.green-api.com/waInstance${idInstance}/SendMessage/${apiTokenInstance}`,
      {
        method: "POST",
        headers: { "Content-Type": "Application/json" },
        body: JSON.stringify({ message, chatId }),
      }
    )
      .catch((e) => alert(`Error: ${e.message}`))
      .then((res) => res?.json())
      .then((data) => {
        if (data.idMessage)
          setAllMessage([...allMessage, { message, my: true }]);
      });
  };

  const getMessage = async () => {
    await fetch(
      `https://api.green-api.com/waInstance${idInstance}/ReceiveNotification/${apiTokenInstance}`,
      {
        method: "GET",
      }
    )
      .catch((e) => alert(`Error: ${e.message}`))
      .then((res) => res?.json())
      .then((data) => {
        if (data != null) {
          const receipt = Number(data?.receiptId);
          setAllMessage([
            ...allMessage,
            {
              message: `${receipt}`,
              my: false,
            },
          ]);
          fetch(
            `https://api.green-api.com/waInstance${idInstance}/DeleteNotification/${apiTokenInstance}/${receipt}`,
            {
              method: "DELETE",
              headers: { "Content-Type": "Application/json" },
              body: JSON.stringify({ receiptId: receipt }),
            }
          )
            .catch((e) => alert(`Error: ${e.message}`))
            .then(() => {
              console.log("Сообщение удалено");
            });
        } else {
          alert("Сообщений нет");
        }
      });
  };

  return (
    <section>
      {!logIn ? (
        <div className="login">
          <input
            name="idInstance"
            className="field"
            type="text"
            placeholder="idInstance"
            required
            onChange={(e) => setIdInstance(e.target.value)}
          />

          <input
            name="apiTokenInstance"
            className="field"
            type="text"
            placeholder="apiTokenInstance"
            required
            onChange={(e) => setApiTokenInstance(e.target.value)}
          />
          <button onClick={() => setLogIn(true)}>add</button>
        </div>
      ) : (
        <form className="login-form" onSubmit={handleMessage}>
          {!logIn && (
            <>
              <input
                name="idInstance"
                className="field"
                type="text"
                placeholder="idInstance"
                required
                onChange={(e) => setIdInstance(e.target.value)}
              />

              <input
                name="apiTokenInstance"
                className="field"
                type="text"
                placeholder="apiTokenInstance"
                required
                onChange={(e) => setApiTokenInstance(e.target.value)}
              />
              <button onClick={() => setLogIn(true)}>add</button>
            </>
          )}

          <textarea
            name="message"
            className="field"
            placeholder="message"
            required
          />

          <input
            name="phoneNumber"
            className="field"
            type="text"
            placeholder="phoneNumber"
            required
          />

          <button type="submit" className="button">
            Send Message
          </button>
        </form>
      )}
      <div>-----------------------------------------</div>
      {logIn && (
        <>
          <button className="get-button" onClick={getMessage}>
            Get Message
          </button>
          <div className="message-block">
            {allMessage.map((el) => (
              <div className={el.my ? "my-message" : "answer"} key={el.message}>
                {el.message}
              </div>
            ))}
          </div>
        </>
      )}
    </section>
  );
};

export default MessageSend;
