from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from django.conf import settings
import logging

logger = logging.getLogger(__name__)

def send_order_confirmation_emails(order, user):
    """
    Send order confirmation emails to both customer and owner
    """
    try:
        # Customer Email
        customer_subject = "Order Confirmation - SmartCart"
        customer_html_message = render_to_string('customer_order_confirmation.html', {
            'order_id': order.id,
            'total_amount': order.total_amount,
            'shipping_address': order.shipping_address
        })
        customer_text_message = strip_tags(customer_html_message)
        
        customer_email = EmailMultiAlternatives(
            customer_subject,
            customer_text_message,
            settings.DEFAULT_FROM_EMAIL,
            [user.email]
        )
        customer_email.attach_alternative(customer_html_message, "text/html")
        customer_email.send(fail_silently=True)
        logger.info(f"Customer confirmation email sent to {user.email}")
    except Exception as e:
        logger.error(f"Failed to send customer email: {str(e)}")
    
    try:
        # Owner Email
        owner_subject = "New Order - SmartCart"
        owner_html_message = render_to_string('owner_order_notification.html', {
            'customer_name': user.username,
            'customer_email': user.email,
            'order_id': order.id,
            'total_amount': order.total_amount,
            'shipping_address': order.shipping_address
        })
        owner_text_message = strip_tags(owner_html_message)
        
        owner_email = EmailMultiAlternatives(
            owner_subject,
            owner_text_message,
            settings.DEFAULT_FROM_EMAIL,
            [settings.OWNER_EMAIL]
        )
        owner_email.attach_alternative(owner_html_message, "text/html")
        owner_email.send(fail_silently=True)
        logger.info(f"Owner notification email sent to {settings.OWNER_EMAIL}")
    except Exception as e:
        logger.error(f"Failed to send owner email: {str(e)}")
