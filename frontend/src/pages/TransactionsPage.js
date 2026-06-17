import React, { useEffect, useState } from "react";
import api from "../services/api";

export default function TransactionsPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await api.get("orders/list/");
        setOrders(response.data);
      } catch (err) {
        console.error("Failed to load orders", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) {
    return <div style={{ padding: 40 }}>Loading transactions...</div>;
  }

  return (
    <div style={{ padding: 32, maxWidth: 1000, margin: "0 auto" }}>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ margin: 0, fontSize: "2rem", color: "#111" }}>Transaction History</h1>
        <p style={{ color: "#666", marginTop: 4 }}>Review all your past orders and spending details.</p>
      </div>

      {orders.length === 0 ? (
        <div style={{ textAlign: "center", padding: "80px 0", background: "white", borderRadius: 20, border: "1px solid #eaeaea" }}>
           <div style={{ fontSize: "4rem", marginBottom: 20 }}>📑</div>
           <h3 style={{ margin: 0, color: "#111" }}>No transactions found</h3>
           <p style={{ color: "#666", marginTop: 8 }}>When you make purchases, they will appear here.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {orders.map((order) => (
            <div key={order.id} style={{
              background: 'white',
              border: '1px solid #eaeaea',
              borderRadius: 16,
              padding: 32,
              boxShadow: '0 4px 12px rgba(0,0,0,0.02)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #eaeaea', paddingBottom: 16, marginBottom: 16 }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Order #{order.id}</h3>
                  <p style={{ margin: '4px 0 0', color: '#666', fontSize: '0.9rem' }}>
                    {new Date(order.created_at).toLocaleString()}
                  </p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '1.2rem', fontWeight: 600, color: '#5f259f' }}>
                    ${parseFloat(order.total_amount).toFixed(2)}
                  </div>
                  <div style={{ fontSize: '0.85rem', color: '#888', marginTop: 4 }}>
                    {order.payment_method || 'Online'}
                  </div>
                </div>
              </div>

              <h4 style={{ margin: '0 0 12px 0', fontSize: '0.95rem', color: '#444' }}>Items Purchased:</h4>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                <thead>
                  <tr style={{ background: '#f9f9f9' }}>
                    <th style={{ padding: '8px 12px', textAlign: 'left', borderRadius: '6px 0 0 6px' }}>Item</th>
                    <th style={{ padding: '8px 12px', textAlign: 'left' }}>Category</th>
                    <th style={{ padding: '8px 12px', textAlign: 'right' }}>Price</th>
                    <th style={{ padding: '8px 12px', textAlign: 'center' }}>Qty</th>
                    <th style={{ padding: '8px 12px', textAlign: 'right', borderRadius: '0 6px 6px 0' }}>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {(order.items && order.items.length > 0) ? order.items.map((item, index) => (
                    <tr key={index} style={{ borderBottom: '1px solid #f0f0f0' }}>
                      <td style={{ padding: '12px', color: '#1a1a1a', fontWeight: 500 }}>{item.name}</td>
                      <td style={{ padding: '12px', color: '#666' }}>{item.category || 'Shopping'}</td>
                      <td style={{ padding: '12px', textAlign: 'right', color: '#666' }}>${parseFloat(item.price).toFixed(2)}</td>
                      <td style={{ padding: '12px', textAlign: 'center', color: '#666' }}>x{item.quantity}</td>
                      <td style={{ padding: '12px', textAlign: 'right', fontWeight: 500 }}>${(parseFloat(item.price) * item.quantity).toFixed(2)}</td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan="5" style={{ padding: '12px', textAlign: 'center', color: '#888', fontStyle: 'italic' }}>
                        Item details were not recorded for this order.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>

              <div style={{ marginTop: 16, fontSize: '0.85rem', color: '#666', background: '#f4f5f7', padding: '10px 16px', borderRadius: 8 }}>
                <strong>Shipping Address:</strong> {order.shipping_address || 'Not provided'}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
