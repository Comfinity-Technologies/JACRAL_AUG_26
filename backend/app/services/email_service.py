"""
JACRAL – Email service.
Sends transactional emails via SMTP (aiosmtplib).
Gracefully degrades if SMTP is not configured.
"""
import asyncio
import logging
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from typing import Optional

from app.config import settings

logger = logging.getLogger(__name__)


def _build_message(to: str, subject: str, html: str) -> MIMEMultipart:
    msg = MIMEMultipart("alternative")
    msg["Subject"] = subject
    msg["From"] = settings.SMTP_FROM_EMAIL
    msg["To"] = to
    msg.attach(MIMEText(html, "html"))
    return msg


async def send_email(
    to: str,
    subject: str,
    html: str,
) -> bool:
    """
    Send an email. Returns True on success, False on failure.
    Never raises – email failures must not block order creation.
    """
    if not settings.smtp_configured:
        logger.warning("SMTP not configured – skipping email to %s", to)
        return False

    try:
        import aiosmtplib  # type: ignore

        msg = _build_message(to, subject, html)
        await aiosmtplib.send(
            msg,
            hostname=settings.SMTP_HOST,
            port=settings.SMTP_PORT,
            username=settings.SMTP_USERNAME,
            password=settings.SMTP_PASSWORD,
            start_tls=True,
        )
        logger.info("Email sent to %s – subject: %s", to, subject)
        return True
    except Exception as exc:
        logger.error("Email send failed to %s: %s", to, exc)
        return False


def send_email_sync(to: str, subject: str, html: str) -> bool:
    """Synchronous wrapper – runs in a background thread if called from sync code."""
    try:
        loop = asyncio.get_event_loop()
        if loop.is_running():
            loop.create_task(send_email(to, subject, html))
            return True
        return loop.run_until_complete(send_email(to, subject, html))
    except Exception as exc:
        logger.error("Email sync wrapper failed: %s", exc)
        return False


# ------------------------------------------------------------------
# Email templates
# ------------------------------------------------------------------

def send_order_confirmation(
    to: str,
    order_id: int,
    total: str,
    customer_name: str,
) -> None:
    html = f"""
    <h2>Thank you for your order, {customer_name}!</h2>
    <p>Your order <strong>#{order_id}</strong> has been placed successfully.</p>
    <p>Total: <strong>₹{total}</strong></p>
    <p>We will notify you when your order is shipped.</p>
    """
    send_email_sync(to, f"Order Confirmation – JACRAL #{order_id}", html)


def send_order_confirmed(to: str, order_id: int) -> None:
    html = f"""
    <h2>Order #{order_id} Confirmed!</h2>
    <p>Your order has been confirmed and is now being processed.</p>
    <p>We will notify you once it's shipped.</p>
    """
    send_email_sync(to, f"Order Confirmed – JACRAL #{order_id}", html)


def send_order_shipped(to: str, order_id: int, tracking_id: Optional[str]) -> None:
    tracking = f"<p>Tracking ID: <strong>{tracking_id}</strong></p>" if tracking_id else ""
    html = f"""
    <h2>Your order #{order_id} has been shipped!</h2>
    {tracking}
    <p>You can track your delivery in your JACRAL account.</p>
    """
    send_email_sync(to, f"Order Shipped – JACRAL #{order_id}", html)


def send_order_delivered(to: str, order_id: int) -> None:
    html = f"""
    <h2>Order #{order_id} delivered!</h2>
    <p>We hope you enjoy your JACRAL products. Thank you for shopping with us!</p>
    """
    send_email_sync(to, f"Order Delivered – JACRAL #{order_id}", html)


def send_order_cancelled(to: str, order_id: int) -> None:
    html = f"""
    <h2>Order #{order_id} Cancelled</h2>
    <p>Your order has been cancelled. If you were charged, a refund will be processed shortly.</p>
    """
    send_email_sync(to, f"Order Cancelled – JACRAL #{order_id}", html)


def send_registration_confirmation(to: str, name: str) -> None:
    html = f"""
    <h2>Welcome to JACRAL, {name}!</h2>
    <p>Your account has been created successfully.</p>
    <p>Start exploring our range of jackfruit and cereal products.</p>
    """
    send_email_sync(to, "Welcome to JACRAL!", html)
