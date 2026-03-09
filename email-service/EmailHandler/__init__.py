import azure.functions as func
import logging
import os
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail

def main(event: func.EventGridEvent) -> None:
    logging.info('Event received: %s', event.get_json())

    data = event.get_json()

    # Extract data
    user_email = data['user_email']
    user_name = data['user_name']
    course_name = data['course_name']

    # Send email using SendGrid
    sg = SendGridAPIClient(os.environ['SENDGRID_API_KEY'])
    message = Mail(
        from_email='noreply@managementconcepts.com',
        to_emails=user_email,
        subject='Course Purchase Confirmation',
        html_content=f'<p>Hi {user_name},</p><p>You have successfully purchased the course: <strong>{course_name}</strong>.</p><p>Thank you for your purchase!</p>'
    )
    sg.send(message)

    logging.info('Email sent to %s', user_email)
