import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../services/api";

export default function PaymentPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { cartItems, cartTotal, shippingAddress } = location.state || {};
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [error, setError] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);

  // Load Razorpay script
  useEffect(() => {
    const loadRazorpay = () => {
      if (window.Razorpay) {
        setRazorpayLoaded(true);
        return;
      }
      
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      
      script.onload = () => setRazorpayLoaded(true);
      script.onerror = () => setError("Failed to load Razorpay checkout.");
      
      document.body.appendChild(script);
    };

    loadRazorpay();
  }, []);

  const handleRazorpayPayment = async () => {
    setIsProcessing(true);
    setError(null);

    try {
      // Step 1: Create order on backend
      const orderResponse = await api.post("orders/razorpay/order/", {
        amount: cartTotal,
      });

      // Step 2: Initialize Razorpay checkout
      const options = {
        key: orderResponse.data.key_id,
        amount: orderResponse.data.amount,
        currency: "INR",
        name: "SmartCart Budget Guard",
        description: "Order Payment",
        order_id: orderResponse.data.order_id,
        handler: async (response) => {
          try {
            // Step 3: Verify payment on backend
            await api.post("orders/razorpay/verify/", {
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
              amount: orderResponse.data.amount,
              shipping_address: shippingAddress,
            });

            setPaymentStatus("success");
            setTimeout(() => {
              navigate("/shop", {
                state: { checkoutMessage: "Payment successful! Order created successfully." }
              });
            }, 2000);
          } catch (verifyErr) {
            setError(verifyErr?.response?.data?.detail || "Payment verification failed.");
          } finally {
            setIsProcessing(false);
          }
        },
        prefill: {
          name: "User",
          email: "user@example.com",
        },
        theme: {
          color: "#5f259f",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

      rzp.on("payment.failed", (response) => {
        setError(`Payment failed: ${response.error.description}`);
        setIsProcessing(false);
      });
    } catch (err) {
      setError(err?.response?.data?.detail || "Failed to initialize payment.");
      setIsProcessing(false);
    }
  };

  // Legacy payment methods (kept for compatibility but can be removed later)
  const handleLegacyPayment = async (paymentMethod) => {
    setIsProcessing(true);
    setError(null);

    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      await api.post("orders/create/", {
        total_amount: cartTotal,
        shipping_address: shippingAddress,
        payment_method: paymentMethod,
      });

      setPaymentStatus("success");
      setTimeout(() => {
        navigate("/shop", {
          state: { checkoutMessage: "Payment successful! Order created successfully." }
        });
      }, 2000);
    } catch (err) {
      setError(err?.response?.data?.detail || "Payment failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };



  if (!cartItems || !cartTotal) {
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

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: "20px" }}>
      <h1>Payment</h1>

      <div style={{ marginBottom: "30px", padding: "20px", border: "1px solid #ddd", borderRadius: "8px" }}>
        <h3>Order Summary</h3>
        <ul style={{ paddingLeft: "20px" }}>
          {cartItems.map((item) => (
            <li key={item.id} style={{ marginBottom: "8px" }}>
              {item.name} × {item.quantity} = ₹{(item.quantity * parseFloat(item.price)).toFixed(2)}
            </li>
          ))}
        </ul>
        <p style={{ fontWeight: "bold", fontSize: "18px" }}>
          Total: ₹{cartTotal.toFixed(2)}
        </p>
        <p><strong>Shipping Address:</strong> {shippingAddress}</p>
      </div>

      <div style={{ marginBottom: "30px" }}>
        <h3>Select Payment Method</h3>

        <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
          {/* Razorpay Option - Primary */}
          <div
            style={{
              flex: "1",
              minWidth: "250px",
              padding: "20px",
              border: selectedPayment === "razorpay" ? "2px solid #0f9d58" : "1px solid #ddd",
              borderRadius: "8px",
              cursor: "pointer",
              backgroundColor: selectedPayment === "razorpay" ? "#e8f5e9" : "white"
            }}
            onClick={() => setSelectedPayment("razorpay")}
          >
            <div style={{ textAlign: "center", marginBottom: "15px" }}>
              <div style={{
                width: "50px",
                height: "50px",
                backgroundColor: "#0f9d58",
                borderRadius: "50%",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                fontSize: "20px",
                fontWeight: "bold"
              }}>
                ₹
              </div>
              <h4 style={{ margin: "10px 0", color: "#0f9d58" }}>Razorpay</h4>
              <p style={{ fontSize: "12px", color: "#666" }}>Pay securely with UPI, Cards, or Net Banking</p>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div style={{ color: "red", marginBottom: "20px", padding: "10px", border: "1px solid red", borderRadius: "4px" }}>
          {error}
        </div>
      )}

      {paymentStatus === "success" && (
        <div style={{ color: "green", marginBottom: "20px", padding: "10px", border: "1px solid green", borderRadius: "4px", textAlign: "center" }}>
          Payment successful! Redirecting to shop...
        </div>
      )}

      {selectedPayment && !paymentStatus && (
        <button
          onClick={handleRazorpayPayment}
          disabled={isProcessing || !razorpayLoaded}
          style={{
            width: "100%",
            padding: "15px",
            backgroundColor: "#0f9d58",
            color: "white",
            border: "none",
            borderRadius: "8px",
            fontSize: "16px",
            fontWeight: "bold",
            cursor: isProcessing ? "not-allowed" : "pointer"
          }}
        >
          {isProcessing ? "Processing..." : `Pay ₹${cartTotal.toFixed(2)}`}
        </button>
      )}
    </div>
  );
}
