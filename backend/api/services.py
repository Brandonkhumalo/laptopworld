import os
import logging
from html import escape
from paynow import Paynow
import resend

logger = logging.getLogger(__name__)

PAYNOW_ID = os.environ.get('Paynow_IntegrationID', '')
PAYNOW_KEY = os.environ.get('Paynow_IntegrationKey', '')
RESEND_KEY = os.environ.get('ResendEmailApiKey', '')
DESTINATION_EMAIL = os.environ.get('Destination', '')


def initiate_paynow_payment(order, return_url, result_url):
    paynow = Paynow(PAYNOW_ID, PAYNOW_KEY, return_url, result_url)
    payment = paynow.create_payment(order.order_number, order.customer_email)

    for item in order.items.all():
        price = float(item.price)
        payment.add(f"{item.product_name} x{item.quantity}", price * item.quantity)

    response = paynow.send(payment)

    if response.success:
        order.paynow_poll_url = response.poll_url
        order.paynow_reference = getattr(response, 'reference', '') or order.order_number
        order.save()
        return {
            'success': True,
            'redirect_url': response.redirect_url,
            'poll_url': response.poll_url,
        }
    else:
        logger.error(f"Paynow payment failed for order {order.order_number}: {response.error}")
        return {
            'success': False,
            'error': response.error or 'Payment initiation failed',
        }


def check_paynow_payment(order):
    if not order.paynow_poll_url:
        return {'paid': False, 'status': 'no_poll_url'}

    try:
        paynow = Paynow(PAYNOW_ID, PAYNOW_KEY, '', '')
        poll_response = paynow.check_transaction_status(order.paynow_poll_url)
        status = poll_response.status.lower() if poll_response.status else ''
    except Exception as e:
        logger.error(f"Paynow poll failed for order {order.order_number}: {e}")
        return {'paid': False, 'status': 'poll_error'}

    if status in ('paid', 'delivered', 'awaiting delivery'):
        return {'paid': True, 'status': status}
    elif status in ('cancelled', 'refunded', 'disputed'):
        order.status = 'cancelled'
        order.save()
        return {'paid': False, 'status': status, 'terminal': True}
    else:
        return {'paid': False, 'status': status}


def process_successful_payment(order):
    if order.payment_confirmed:
        return

    order.payment_confirmed = True
    order.status = 'paid'
    order.save()

    for item in order.items.all():
        if item.product:
            item.product.stock = max(0, item.product.stock - item.quantity)
            item.product.save()

    send_order_emails(order)


def send_order_emails(order):
    if not RESEND_KEY:
        logger.warning("Resend API key not configured, skipping emails")
        return

    resend.api_key = RESEND_KEY

    items_html = ""
    for item in order.items.all():
        items_html += f"""
        <tr>
            <td style="padding: 8px; border-bottom: 1px solid #eee;">{escape(item.product_name)}</td>
            <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: center;">{item.quantity}</td>
            <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right;">${item.price:.2f}</td>
            <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right;">${(item.price * item.quantity):.2f}</td>
        </tr>
        """

    # --- Admin/Destination email: full order details ---
    delivery_section = ""
    if order.fulfillment_type == 'delivery' and order.delivery_address:
        delivery_section = f"""
            <div style="background: #fff3cd; border: 1px solid #ffc107; border-radius: 6px; padding: 12px; margin: 12px 0;">
                <h3 style="color: #856404; margin: 0 0 8px 0;">Delivery Details</h3>
                <p style="margin: 4px 0;"><strong>Address:</strong> {escape(order.delivery_address)}</p>
                {"<p style='margin: 4px 0;'><strong>Coordinates:</strong> " + str(order.delivery_lat) + ", " + str(order.delivery_lng) + "</p>" if order.delivery_lat and order.delivery_lng else ""}
                <p style="margin: 4px 0;"><strong>Delivery Fee:</strong> ${order.delivery_fee:.2f}</p>
            </div>
        """

    admin_html = f"""
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #0a1628; padding: 20px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 24px;">Laptop World</h1>
            <p style="color: #94a3b8; margin: 5px 0 0 0; font-size: 14px;">New Order Notification</p>
        </div>
        <div style="padding: 20px; background: #ffffff;">
            <div style="background: #d4edda; border: 1px solid #28a745; border-radius: 6px; padding: 12px; margin-bottom: 16px;">
                <h2 style="color: #155724; margin: 0;">Payment Confirmed</h2>
                <p style="color: #155724; margin: 4px 0 0 0; font-size: 18px;"><strong>Order ID:</strong> {escape(order.order_number)}</p>
            </div>

            <h3 style="color: #0a1628;">Customer Information</h3>
            <p style="margin: 4px 0;"><strong>Name:</strong> {escape(order.customer_name)}</p>
            <p style="margin: 4px 0;"><strong>Email:</strong> {escape(order.customer_email)}</p>
            <p style="margin: 4px 0;"><strong>Phone:</strong> {escape(order.customer_phone)}</p>
            <p style="margin: 4px 0;"><strong>Fulfillment:</strong> {order.get_fulfillment_type_display()}</p>
            {"<p style='margin: 4px 0;'><strong>Notes:</strong> " + escape(order.notes) + "</p>" if order.notes else ""}

            {delivery_section}

            <h3 style="color: #0a1628; margin-top: 20px;">Order Items</h3>
            <table style="width: 100%; border-collapse: collapse;">
                <thead>
                    <tr style="background: #f5f5f5;">
                        <th style="padding: 8px; text-align: left;">Product</th>
                        <th style="padding: 8px; text-align: center;">Qty</th>
                        <th style="padding: 8px; text-align: right;">Price</th>
                        <th style="padding: 8px; text-align: right;">Subtotal</th>
                    </tr>
                </thead>
                <tbody>
                    {items_html}
                </tbody>
            </table>
            <div style="text-align: right; margin-top: 10px; font-size: 18px;">
                <strong>Total: ${order.total:.2f}</strong>
            </div>
        </div>
        <div style="background: #f5f5f5; padding: 15px; text-align: center; font-size: 12px; color: #666;">
            <p>Laptop World | First Street & George Silundika, Harare</p>
        </div>
    </div>
    """

    # --- Customer email: confirmation with contact info ---
    customer_delivery_note = ""
    if order.fulfillment_type == 'delivery' and order.delivery_address:
        customer_delivery_note = f"""
            <p style="margin: 4px 0;"><strong>Delivery Address:</strong> {escape(order.delivery_address)}</p>
            <p style="margin: 4px 0;"><strong>Delivery Fee:</strong> ${order.delivery_fee:.2f}</p>
        """

    customer_html = f"""
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #0a1628; padding: 20px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 24px;">Laptop World</h1>
        </div>
        <div style="padding: 20px; background: #ffffff;">
            <p style="font-size: 16px;">Hi {escape(order.customer_name)},</p>
            <p>Thank you for your purchase! Your payment has been confirmed.</p>

            <h2 style="color: #0a1628;">Order Confirmation</h2>
            <p><strong>Order Number:</strong> {escape(order.order_number)}</p>
            <p><strong>Fulfillment:</strong> {order.get_fulfillment_type_display()}</p>
            {customer_delivery_note}

            <h3 style="color: #0a1628; margin-top: 20px;">Order Items</h3>
            <table style="width: 100%; border-collapse: collapse;">
                <thead>
                    <tr style="background: #f5f5f5;">
                        <th style="padding: 8px; text-align: left;">Product</th>
                        <th style="padding: 8px; text-align: center;">Qty</th>
                        <th style="padding: 8px; text-align: right;">Price</th>
                        <th style="padding: 8px; text-align: right;">Subtotal</th>
                    </tr>
                </thead>
                <tbody>
                    {items_html}
                </tbody>
            </table>
            <div style="text-align: right; margin-top: 10px; font-size: 18px;">
                <strong>Total: ${order.total:.2f}</strong>
            </div>

            <p style="margin-top: 20px;">We will notify you when your order is ready for {'delivery' if order.fulfillment_type == 'delivery' else 'collection'}.</p>
            <p>Thank you for shopping with Laptop World!</p>

            <div style="background: #f0f4ff; border: 1px solid #c7d2fe; border-radius: 6px; padding: 12px; margin-top: 20px;">
                <p style="margin: 0 0 8px 0; font-weight: bold; color: #0a1628;">Have any queries?</p>
                <p style="margin: 4px 0;">Email: <a href="mailto:sales@laptopworld.co.zw" style="color: #2563eb;">sales@laptopworld.co.zw</a></p>
                <p style="margin: 4px 0;">Email: <a href="mailto:info@laptopworld.co.zw" style="color: #2563eb;">info@laptopworld.co.zw</a></p>
                <p style="margin: 4px 0;">Call: 0782 482 482 | 0771 796 666</p>
            </div>
        </div>
        <div style="background: #f5f5f5; padding: 15px; text-align: center; font-size: 12px; color: #666;">
            <p>Laptop World | First Street & George Silundika, Harare</p>
            <p>0782 482 482 | 0771 796 666</p>
            <p style="color: #999; margin-top: 8px;">This is an automated message. Please do not reply to this email.</p>
        </div>
    </div>
    """

    # Send admin notification email
    try:
        if DESTINATION_EMAIL:
            resend.Emails.send({
                "from": "Laptop World <noreply@laptopworld.co.zw>",
                "to": [DESTINATION_EMAIL],
                "subject": f"New Order #{order.order_number} - Payment Confirmed - {order.get_fulfillment_type_display()}",
                "html": admin_html,
            })
            logger.info(f"Admin notification sent to {DESTINATION_EMAIL} for order {order.order_number}")
    except Exception as e:
        logger.error(f"Failed to send admin email for order {order.order_number}: {e}")

    # Send customer confirmation email
    try:
        resend.Emails.send({
            "from": "Laptop World <noreply@laptopworld.co.zw>",
            "to": [order.customer_email],
            "reply_to": ["sales@laptopworld.co.zw", "info@laptopworld.co.zw"],
            "subject": f"Order Confirmed - #{order.order_number}",
            "html": customer_html,
        })
        logger.info(f"Customer confirmation sent to {order.customer_email} for order {order.order_number}")
    except Exception as e:
        logger.error(f"Failed to send customer email for order {order.order_number}: {e}")
