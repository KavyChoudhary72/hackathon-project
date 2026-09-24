import asyncio
import logging
from typing import Dict, Set, Optional, Any
from fastapi import WebSocket, WebSocketDisconnect
from app.core.events import event_bus

logger = logging.getLogger("surplus2shelter.ws_hub")


class WebSocketHub:
    def __init__(self):
        self.active_connections: Set[WebSocket] = set()
        self.connection_meta: Dict[WebSocket, Dict[str, Optional[str]]] = {}

    async def connect(self, websocket: WebSocket, role: Optional[str] = None, user_id: Optional[str] = None):
        await websocket.accept()
        self.active_connections.add(websocket)
        self.connection_meta[websocket] = {"role": role, "user_id": user_id}
        logger.info(f"WebSocket client connected. Total connections: {len(self.active_connections)}")

    def disconnect(self, websocket: WebSocket):
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)
            self.connection_meta.pop(websocket, None)
            logger.info(f"WebSocket client disconnected. Remaining: {len(self.active_connections)}")

    async def broadcast_event(self, event_payload: Dict[str, Any]):
        """Broadcasts an event bus payload to connected clients matching optional role/id filters."""
        if not self.active_connections:
            return

        dead_sockets = []
        for connection in list(self.active_connections):
            meta = self.connection_meta.get(connection, {})
            req_role = meta.get("role")
            req_id = meta.get("user_id")

            # Filter check if specified
            if req_role and event_payload.get("data", {}).get("target_role") not in [None, req_role]:
                continue
            if req_id and event_payload.get("data", {}).get("target_user_id") not in [None, req_id]:
                continue

            try:
                await connection.send_json(event_payload)
            except Exception as exc:
                logger.warning(f"Error sending WebSocket message: {exc}")
                dead_sockets.append(connection)

        for socket in dead_sockets:
            self.disconnect(socket)

    async def start_heartbeat(self, interval_seconds: int = 20):
        """Sends a ping heartbeat frame every `interval_seconds` to keep connections alive."""
        while True:
            await asyncio.sleep(interval_seconds)
            dead_sockets = []
            for connection in list(self.active_connections):
                try:
                    await connection.send_json({"type": "ping", "at": asyncio.get_event_loop().time()})
                except Exception:
                    dead_sockets.append(connection)
            for socket in dead_sockets:
                self.disconnect(socket)


ws_hub = WebSocketHub()

# Subscribe WebSocket Hub to receive all event_bus events
async def _ws_event_handler(event_payload: Dict[str, Any]):
    await ws_hub.broadcast_event(event_payload)

event_bus.subscribe("*", _ws_event_handler)
