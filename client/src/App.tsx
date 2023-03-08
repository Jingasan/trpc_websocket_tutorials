import { useEffect, useReducer, useRef } from "react";
import { trpcWebSocket } from "./trpc-websocket";

// メッセージアプリのコンポーネント
export default function App() {
  const [, forceUpdate] = useReducer((x) => x + 1, 0);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const messagesRef = useRef<string[]>([]);
  // 初期化処理
  useEffect(() => {
    // 購読(Subscribe)処理の実行
    const subscription = trpcWebSocket.onAdd.subscribe(undefined, {
      // メッセージが送られてきたら実行される処理を登録
      onData(data) {
        messagesRef.current = [...messagesRef.current, data.message];
        forceUpdate();
      },
      onError(err) {
        console.error("error", err);
      },
    });
    // アンマウント時処理の登録
    return () => {
      console.log("Unmaunt");
      // アンマウントされたときは購読(Subscribe)解除する(購読解除しないと最初のコネクションが残ってしまう)
      subscription.unsubscribe();
    };
  }, []);

  // Publish処理
  const addMessage = () => {
    if (!inputRef.current) {
      return;
    }
    // テキストボックスに入力されたメッセージのPublish処理
    // Publishを行うと、購読(Subscribe)しているため、上記のonDataの処理が走る
    trpcWebSocket.add.mutate({ message: inputRef.current.value });
    inputRef.current.value = "";
  };

  return (
    <>
      <h1>メッセージングアプリ</h1>
      <div>
        <label id="name">メッセージ</label>
        <input
          ref={(ref) => {
            inputRef.current = ref;
          }}
          name="name"
        />
        <button onClick={addMessage}>追加</button>
      </div>
      <div>
        {messagesRef.current.map((m, index) => (
          <span key={index}>
            {m}
            <br />
          </span>
        ))}
      </div>
    </>
  );
}
