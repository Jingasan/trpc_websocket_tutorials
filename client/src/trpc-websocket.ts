import { createTRPCProxyClient, createWSClient, wsLink } from "@trpc/client";
import type { AppRouter } from "../../router/router";

// WebSocket通信の確立
const wsClient = createWSClient({
  url: `ws://localhost:3001`,
});

// WebSocket通信を行うtRPCクライアントの作成
export const trpcWebSocket = createTRPCProxyClient<AppRouter>({
  links: [
    wsLink({
      client: wsClient,
    }),
  ],
});
