import uuid
import time
from decimal import Decimal
from paynow import Paynow

# Initialize PayNow
paynow = Paynow(
    integration_id="23845",
    integration_key="d87e9779-72c5-4965-a6aa-d21136552408",
    return_url="https://laptopworld.co.zw/payment-status",
    result_url="https://laptopworld.co.zw/api/payment-result",
)

order_id = uuid.uuid4()
merchant_email = "info@laptopworld.co.zw"

# Create payment with merchant email as authemail
payment = paynow.create_payment(f"Order_{order_id}", merchant_email)
payment.add(f"Test Order #{order_id}", 150.75)

# Send via EcoCash express checkout with test success number
response = paynow.send_mobile(payment, "0771111111", "ecocash")

print("Success:", response.success)
if response.success:
    print("Instructions:", response.instruction)
    print("Poll URL:", response.poll_url)
    print()

    # Poll for payment status
    print("Waiting for simulated payment...")
    for i in range(5):
        time.sleep(5)
        status = paynow.check_transaction_status(response.poll_url)
        print(f"Poll {i + 1} - Status: {status.status}, Paid: {status.paid}")
        if status.paid:
            print("\nPayment completed successfully!")
            print("Amount:", status.amount)
            print("Reference:", status.reference)
            print("PayNow Ref:", status.paynow_reference)
            break
else:
    print("Error:", response.error)
