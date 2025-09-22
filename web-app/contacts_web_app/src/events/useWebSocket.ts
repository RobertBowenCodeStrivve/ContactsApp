import { useEffect, useState } from 'react';

 export const ContactEventTypes = { //for some reason can't import in vite from @contacts/common? not sure what the issue is
      CREATED: "CREATED",
      UPDATED: "UPDATED",
      DELETED: "DELETED"
  } as const;

 interface WebSocketMessage {
    event: string;
    data: any;
  }

  export const useWebSocket = (url: string) => {
    const [socket, setSocket] = useState(null as WebSocket | null);
    const [lastMessage, setLastMessage] = useState<WebSocketMessage | null>(null);

    useEffect(() => {
      const ws = new WebSocket(url);
      ws.onopen = () => console.log('WebSocket connected');
      ws.onmessage = (event) => {
        setLastMessage(JSON.parse(event.data));
      };
      setSocket(ws);
      return () => ws.close();
    }, [url]);

    return { socket, lastMessage };
  };