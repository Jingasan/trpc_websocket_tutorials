import { applyWSSHandler } from "@trpc/server/adapters/ws";
import ws from "ws";
import { appRouter } from "../router/router";

const wss = new ws.Server({
  port: 3001,
});
const handler = applyWSSHandler({ wss, router: appRouter });

// 接続確立時の処理
wss.on("connection", (ws) => {
  console.info(`Connection (${wss.clients.size})`);
  // 接続終了時の処理
  ws.once("close", () => {
    // 接続数の表示
    console.info(`Connection (${wss.clients.size})`);
  });
});
console.info("WebSocket Server listening on ws://localhost:3001");

// サーバーのプロセス終了時の処理
process.on("SIGTERM", () => {
  console.info("SIGTERM");
  handler.broadcastReconnectNotification();
  wss.close();
});
