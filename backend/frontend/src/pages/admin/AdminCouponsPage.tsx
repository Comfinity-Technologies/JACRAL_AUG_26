import { useEffect, useState } from "react";
import { apiClient } from "../../api/client";
import { Plus } from "lucide-react";

interface Coupon {
  id: number;
  code: string;
  discount_type: string;
  discount_value: number;
  minimum_order_amount: number;
  used_count: number;
  is_active: boolean;
}

const AdminCouponsPage = () => {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    code: "", discount_type: "percentage", discount_value: "", minimum_order_amount: "0"
  });

  const fetchCoupons = async () => {
    try {
      const res = await apiClient.get("/api/v1/admin/coupons");
      setCoupons(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiClient.post("/api/v1/admin/coupons", {
        ...formData,
        discount_value: parseFloat(formData.discount_value),
        minimum_order_amount: parseFloat(formData.minimum_order_amount)
      });
      setShowForm(false);
      setFormData({ code: "", discount_type: "percentage", discount_value: "", minimum_order_amount: "0" });
      fetchCoupons();
    } catch (err: any) {
      alert(err.response?.data?.detail || "Failed to create coupon");
    }
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Coupons</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          <Plus className="w-4 h-4" />
          <span>Add Coupon</span>
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="bg-white p-6 rounded-lg shadow-sm border grid grid-cols-5 gap-4 items-end">
          <div>
            <label className="block text-sm font-medium mb-1">Code</label>
            <input required type="text" className="w-full border rounded px-3 py-2" value={formData.code} onChange={e => setFormData({...formData, code: e.target.value.toUpperCase()})} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Type</label>
            <select className="w-full border rounded px-3 py-2" value={formData.discount_type} onChange={e => setFormData({...formData, discount_type: e.target.value})}>
              <option value="percentage">Percentage (%)</option>
              <option value="fixed">Fixed Amount (₹)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Value</label>
            <input required type="number" step="0.01" className="w-full border rounded px-3 py-2" value={formData.discount_value} onChange={e => setFormData({...formData, discount_value: e.target.value})} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Min Order</label>
            <input required type="number" step="0.01" className="w-full border rounded px-3 py-2" value={formData.minimum_order_amount} onChange={e => setFormData({...formData, minimum_order_amount: e.target.value})} />
          </div>
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded h-10 w-full">Save</button>
        </form>
      )}

      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-x-auto">
        <table className="w-full whitespace-nowrap">
          <thead className="bg-gray-50 text-gray-600 text-left text-sm uppercase">
            <tr>
              <th className="px-6 py-3">Code</th>
              <th className="px-6 py-3">Type</th>
              <th className="px-6 py-3">Value</th>
              <th className="px-6 py-3">Min Order</th>
              <th className="px-6 py-3">Used</th>
              <th className="px-6 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {coupons.map(c => (
              <tr key={c.id}>
                <td className="px-6 py-4 font-bold text-gray-800">{c.code}</td>
                <td className="px-6 py-4 capitalize">{c.discount_type}</td>
                <td className="px-6 py-4">{c.discount_type === 'percentage' ? `${c.discount_value}%` : `₹${c.discount_value}`}</td>
                <td className="px-6 py-4">₹{c.minimum_order_amount}</td>
                <td className="px-6 py-4">{c.used_count}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${c.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {c.is_active ? "Active" : "Inactive"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminCouponsPage;
