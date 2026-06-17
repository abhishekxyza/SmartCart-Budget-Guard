import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function PaymentSuccessPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { orderDetails, paymentMethod } = location.state || {};

  const generateReceipt = () => {
    if (!orderDetails) return null;

    const receiptData = {
      orderId: orderDetails.id,
      date: new Date(orderDetails.created_at).toLocaleString(),
      items: orderDetails.items || [],
      total: orderDetails.total_amount,
      paymentMethod: paymentMethod,
      shippingAddress: orderDetails.shipping_address,
    };

    return receiptData;
  };

  const downloadReceipt = () => {
    const receipt = generateReceipt();
    if (!receipt) return;

    const receiptText = `
SMARTCART BUDGET GUARD - PAYMENT RECEIPT
=========================================

Order ID: ${receipt.orderId}
Date: ${receipt.date}
Payment Method: ${receipt.paymentMethod}

Items Purchased:
${receipt.items.map(item => `- ${item.name} x ${item.quantity} = $${(item.quantity * parseFloat(item.price)).toFixed(2)}`).join('\n')}

Total Amount: $${parseFloat(receipt.total).toFixed(2)}

Shipping Address:
${receipt.shipping_address}

Thank you for your purchase!
=========================================
    `.trim();

    const blob = new Blob([receiptText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `receipt-order-${receipt.orderId}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (!orderDetails) {
    return (
      <div style={{ maxWidth: 600, margin: "50px auto", textAlign: "center" }}>
        <h2>Payment Error</h2>
        <p>No order details found. Please go back to the shop and try again.</p>
        <button onClick={() => navigate("/shop")} style={{ padding: "10px 20px" }}>
          Back to Shop
        </button>
      </div>
    );
  }

  const receipt = generateReceipt();

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: "20px" }}>
      <div style={{
        textAlign: "center",
        marginBottom: "30px",
        padding: "30px",
        backgroundColor: "#d4edda",
        border: "1px solid #c3e6cb",
        borderRadius: "8px",
        color: "#155724"
      }}>
        <div style={{ fontSize: "48px", marginBottom: "10px" }}>✅</div>
        <h1>Payment Successfully Completed!</h1>
        <p>Your order has been placed and payment has been processed.</p>
      </div>

      <div style={{ marginBottom: "30px", padding: "20px", border: "1px solid #ddd", borderRadius: "8px" }}>
        <h2>Order Receipt</h2>

        <div style={{ marginBottom: "20px" }}>
          <strong>Order ID:</strong> {receipt.orderId}<br />
          <strong>Date:</strong> {receipt.date}<br />
          <strong>Payment Method:</strong> {receipt.paymentMethod}
        </div>

        <div style={{ marginBottom: "20px" }}>
          <h3>Items Purchased:</h3>
          <ul style={{ paddingLeft: "20px" }}>
            {receipt.items.map((item, index) => (
              <li key={index} style={{ marginBottom: "5px" }}>
                {item.name} × {item.quantity} = ${(item.quantity * parseFloat(item.price)).toFixed(2)}
              </li>
            ))}
          </ul>
        </div>

        <div style={{ marginBottom: "20px" }}>
          <strong>Total Amount:</strong> ${parseFloat(receipt.total).toFixed(2)}
        </div>

        <div style={{ marginBottom: "20px" }}>
          <strong>Shipping Address:</strong><br />
          {receipt.shipping_address}
        </div>
      </div>

      <div style={{ display: "flex", gap: "10px", justifyContent: "center", flexWrap: "wrap" }}>
        <button
          onClick={downloadReceipt}
          style={{
            padding: "12px 24px",
            backgroundColor: "#28a745",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "16px"
          }}
        >
          📄 Download Receipt
        </button>

        <button
          onClick={() => navigate("/shop")}
          style={{
            padding: "12px 24px",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "16px"
          }}
        >
          🛒 Continue Shopping
        </button>
      </div>
    </div>
  );
}