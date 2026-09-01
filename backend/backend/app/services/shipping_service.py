"""
JACRAL – Shipping service abstraction (Shiprocket).
Gracefully degrades if credentials are not configured.
"""
import logging
from typing import Optional

import httpx

from app.config import settings

logger = logging.getLogger(__name__)

_SHIPROCKET_AUTH_URL = "https://apiv2.shiprocket.in/v1/external/auth/login"
_SHIPROCKET_ORDER_URL = "https://apiv2.shiprocket.in/v1/external/orders/create/adhoc"
_SHIPROCKET_TRACK_URL = "https://apiv2.shiprocket.in/v1/external/courier/track/shipment/{}"

_token_cache: dict = {}


async def _get_token() -> Optional[str]:
    """Authenticate with Shiprocket and cache the token."""
    if not settings.shiprocket_configured:
        return None

    cached = _token_cache.get("token")
    if cached:
        return cached

    try:
        async with httpx.AsyncClient() as client:
            resp = await client.post(
                _SHIPROCKET_AUTH_URL,
                json={
                    "email": settings.SHIPROCKET_EMAIL,
                    "password": settings.SHIPROCKET_PASSWORD,
                },
                timeout=10,
            )
            resp.raise_for_status()
            token = resp.json().get("token")
            _token_cache["token"] = token
            return token
    except Exception as exc:
        logger.error("Shiprocket auth failed: %s", exc)
        return None


async def create_shipment(order_data: dict) -> Optional[dict]:
    """
    Create a Shiprocket shipment.
    Returns the Shiprocket response or None if not configured/failed.
    """
    if not settings.shiprocket_configured:
        logger.warning("Shiprocket not configured – skipping shipment creation")
        return None

    token = await _get_token()
    if not token:
        return None

    try:
        async with httpx.AsyncClient() as client:
            resp = await client.post(
                _SHIPROCKET_ORDER_URL,
                json=order_data,
                headers={"Authorization": f"Bearer {token}"},
                timeout=15,
            )
            resp.raise_for_status()
            return resp.json()
    except Exception as exc:
        logger.error("Shiprocket create_shipment failed: %s", exc)
        return None


async def get_tracking(shipment_id: str) -> Optional[dict]:
    """Return tracking info for a shipment."""
    if not settings.shiprocket_configured:
        return None

    token = await _get_token()
    if not token:
        return None

    try:
        async with httpx.AsyncClient() as client:
            resp = await client.get(
                _SHIPROCKET_TRACK_URL.format(shipment_id),
                headers={"Authorization": f"Bearer {token}"},
                timeout=10,
            )
            resp.raise_for_status()
            return resp.json()
    except Exception as exc:
        logger.error("Shiprocket tracking failed for %s: %s", shipment_id, exc)
        return None
