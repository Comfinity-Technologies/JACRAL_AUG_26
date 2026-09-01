import { useEffect, useState } from "react";
import { apiClient } from "../../api/client";

interface Order {
  id: number;
  user_id: number;
  status: string;
  payment_status: string;
  total_amount: number;
  shipping_name: string;
  created_at: string;
}

const AdminOrdersPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const res = await apiClient.get("/api/v1/admin/orders?limit=50");
      setOrders(res.data.items);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId: number, newStatus: string) => {
    try {
      await apiClient.patch(`/api/v1/admin/orders/${orderId}/status`, { status: newStatus });
      fetchOrders();
    } catch (err: any) {
      alert(err.response?.data?.detail || "Failed to update status");
    }
  };

  if (isLoading) return <div>Loading orders...</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Orders</h1>
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-x-auto">
        <table className="w-full whitespace-nowrap">
          <thead className="bg-gray-50 text-gray-600 text-left text-sm uppercase">
            <tr>
              <th className="px-6 py-3">Order ID</th>
              <th className="px-6 py-3">Customer</th>
              <th className="px-6 py-3">Date</th>
              <th className="px-6 py-3">Total</th>
              <th className="px-6 py-3">Payment</th>
              <th className="px-6 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {orders.map(o => (
              <tr key={o.id}>
                <td className="px-6 py-4 font-semibold">#{o.id}</td>
                <td className="px-6 py-4">{o.shipping_name}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{new Date(o.created_at).toLocaleDateString()}</td>
                <td className="px-6 py-4">₹{o.total_amount}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${o.payment_status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                    {o.payment_status.toUpperCase()}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <select
                    className="border rounded px-2 py-1 bg-white"
                    value={o.status}
                    onChange={(e) => handleStatusChange(o.id, e.target.value)}
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="processing">Processing</option>
                    <option value="packed">Packed</option>
                    <option value="shipped">Shipped</option>
                    <option value="out_for_delivery">Out for Delivery</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminOrdersPage;
