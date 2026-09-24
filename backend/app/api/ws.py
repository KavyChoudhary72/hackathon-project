from typing import Optional
from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from app.core.ws_hub import ws_hub

router = APIRouter(prefix="/ws", tags=["WebSocket Stream"])


@router.websocket("/live")
async def websocket_live_stream(
    websocket: WebSocket,
    role: Optional[str] = None,
    user_id: Optional[str] = None
):
    """
    Native WebSocket endpoint broadcasting event bus events in real-time.
    Supports optional filters: ?role=SHELTER&user_id=shelter_akshaya_patra
    """
    await ws_hub.connect(websocket, role=role, user_id=user_id)
    try:
        while True:
            data = await websocket.receive_text()
            # Incoming client messages (e.g. client pong responses)
    except WebSocketDisconnect:
        ws_hub.disconnect(websocket)
