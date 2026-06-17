import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

export default function OrdersHistoryPage() {
  const [orders, setOrders] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await api.get("orders/list/");
        setOrders(response.data);
      } catch (err) {
        setError(err?.response?.data?.detail || "Unable to load orders.");
      }
    };

    fetchOrders();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return '#6b7280';
      case 'confirmed':
        return '#3b82f6';
      case 'preparing':
        return '#f59e0b';
      case 'out_for_delivery':
        return '#f97316';
      case 'delivered':
        return '#10b981';
      case 'cancelled':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending':
        return 'Pending';
      case 'confirmed':
        return 'Confirmed';
      case 'preparing':
        return 'Preparing';
      case 'out_for_delivery':
        return 'Out for Delivery';
      case 'delivered':
        return 'Delivered';
      case 'cancelled':
        return 'Cancelled';
      default:
        return status;
    }
  };

  // Calculate statistics
  const totalOrders = orders?.length || 0;
  const recentOrders = orders?.filter(order => {
    const orderDate = new Date(order.created_at);
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    return orderDate >= oneWeekAgo;
  }).length || 0;

  const deliveredOrders = orders?.filter(order => order.status === 'delivered').length || 0;

  const totalSpent = orders?.reduce((sum, order) => {
    return sum + parseFloat(order.total_amount);
  }, 0) || 0;

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 30 }}>
        <div>
          <h1 style={{ margin: 0 }}>Order History</h1>
          <p style={{ color: '#6b7280', margin: '5px 0 0 0' }}>Track your orders and deliveries</p>
        </div>
        <Link
          to="/dashboard"
          style={{
            padding: '10px 20px',
            backgroundColor: '#5f259f',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '8px',
            fontWeight: 'bold'
          }}
        >
          ← Back to Dashboard
        </Link>
      </div>

      {/* Statistics Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '30px' }}>
        <div style={{
          padding: '20px',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          borderRadius: '12px',
          color: 'white'
        }}>
          <h3 style={{ margin: 0, fontSize: '14px', opacity: 0.9 }}>Total Orders</h3>
          <p style={{ margin: '10px 0 0 0', fontSize: '32px', fontWeight: 'bold' }}>{totalOrders}</p>
        </div>

        <div style={{
          padding: '20px',
          background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
          borderRadius: '12px',
          color: 'white'
        }}>
          <h3 style={{ margin: 0, fontSize: '14px', opacity: 0.9 }}>Recent Orders (7 days)</h3>
          <p style={{ margin: '10px 0 0 0', fontSize: '32px', fontWeight: 'bold' }}>{recentOrders}</p>
        </div>

        <div style={{
          padding: '20px',
          background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
          borderRadius: '12px',
          color: 'white'
        }}>
          <h3 style={{ margin: 0, fontSize: '14px', opacity: 0.9 }}>Delivered Orders</h3>
          <p style={{ margin: '10px 0 0 0', fontSize: '32px', fontWeight: 'bold' }}>{deliveredOrders}</p>
        </div>

        <div style={{
          padding: '20px',
          background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
          borderRadius: '12px',
          color: 'white'
        }}>
          <h3 style={{ margin: 0, fontSize: '14px', opacity: 0.9 }}>Total Spent</h3>
          <p style={{ margin: '10px 0 0 0', fontSize: '32px', fontWeight: 'bold' }}>Rs. {totalSpent.toFixed(2)}</p>
        </div>
      </div>

      {error && (
        <div style={{ color: 'red', marginBottom: '20px', padding: '10px', border: '1px solid red', borderRadius: '4px' }}>
          {error}
        </div>
      )}

      {!orders && <p style={{ textAlign: 'center', padding: '40px' }}>Loading orders…</p>}

      {orders && !orders.length && (
        <div style={{ textAlign: 'center', padding: '40px', border: '1px dashed #ddd', borderRadius: '8px' }}>
          <h3>No orders yet</h3>
          <p>Start shopping to see your orders here!</p>
          <Link
            to="/shop"
            style={{
              display: 'inline-block',
              marginTop: '15px',
              padding: '10px 20px',
              backgroundColor: '#5f259f',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '8px',
              fontWeight: 'bold'
            }}
          >
            Go Shopping
          </Link>
        </div>
      )}

      {orders && orders.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {orders.map((order) => (
            <div
              key={order.id}
              style={{
                padding: '20px',
                border: '1px solid #e5e7eb',
                borderRadius: '12px',
                background: 'white',
                boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '20px' }}>
                <div style={{ flex: '1', minWidth: '200px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                    <h3 style={{ margin: 0 }}>Order #{order.id}</h3>
                    <span
                      style={{
                        padding: '4px 12px',
                        backgroundColor: getStatusColor(order.status),
                        color: 'white',
                        borderRadius: '20px',
                        fontSize: '12px',
                        fontWeight: 'bold'
                      }}
                    >
                      {getStatusText(order.status)}
                    </span>
                  </div>
                  
                  <p style={{ margin: '5px 0', color: '#6b7280', fontSize: '14px' }}>
                    <strong>Date:</strong> {new Date(order.created_at).toLocaleString()}
                  </p>
                  
                  <p style={{ margin: '5px 0', color: '#6b7280', fontSize: '14px' }}>
                    <strong>Total:</strong> Rs. {order.total_amount}
                  </p>
                  
                  <p style={{ margin: '5px 0', color: '#6b7280', fontSize: '14px' }}>
                    <strong>Address:</strong> {order.shipping_address}
                  </p>
                </div>

                {/* Delivery Tracking */}
                {(order.status !== 'delivered' && order.status !== 'cancelled') && (
                  <div style={{ flex: '1', minWidth: '250px', paddingLeft: '20px', borderLeft: '2px solid #e5e7eb' }}>
                    <h4 style={{ margin: '0 0 15px 0' }}>Live Tracking</h4>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {/* Status Progress */}
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '5px' }}>
                          <span style={{ color: getStatusColor(order.status) }}>📍</span>
                        <span style={{ fontWeight: 'bold', fontSize: '14px' }}>Status: {getStatusText(order.status)}</span>
                        </div>
                        <div style={{ height: '6px', background: '#e5e7eb', borderRadius: '3px', overflow: 'hidden' }}>
                          <div
                            style={{
                              height: '100%',
                              background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
                              width: order.status === 'delivered' ? '100%' :
                                    order.status === 'out_for_delivery' ? '75%' :
                                    order.status === 'preparing' ? '50%' :
                                    order.status === 'confirmed' ? '25%' : '0%',
                              borderRadius: '3px',
                              transition: 'width 0.5s ease'
                            }}
                          />
                        </div>
                      </div>

                      {order.delivery_boy_name && (
                        <div style={{ fontSize: '14px', color: '#6b7280' }}>
                          <strong>Delivery Boy:</strong> {order.delivery_boy_name}
                          {order.delivery_boy_phone && ` (${order.delivery_boy_phone})`}
                        </div>
                      )}

                      {order.current_location && (
                        <div style={{ fontSize: '14px', color: '#6b7280' }}>
                          <strong>Current Location:</strong> {order.current_location}
                        </div>
                      )}

                      {order.estimated_delivery_time && (
                        <div style={{ fontSize: '14px', color: '#6b7280' }}>
                          <strong>Estimated Delivery:</strong> {new Date(order.estimated_delivery_time).toLocaleString()}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {order.status === 'delivered' && (
                  <div style={{ flex: '1', minWidth: '250px', paddingLeft: '20px', borderLeft: '2px solid #10b981' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                      <span style={{ fontSize: '24px' }}>✅</span>
                      <span style={{ fontWeight: 'bold', color: '#10b981' }}>Delivered Successfully!</span>
                    </div>
                    {order.delivered_at && (
                      <p style={{ margin: '5px 0', color: '#6b7280', fontSize: '14px' }}>
                        Delivered on: {new Date(order.delivered_at).toLocaleString()}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
