import { useEffect, useState } from "react";
import { apiClient } from "../../api/client";
import { Users, ShoppingBag, ListOrdered, DollarSign, AlertCircle } from "lucide-react";

interface DashboardData {
  total_customers: number;
  total_products: number;
  total_orders: number;
  total_revenue: number;
  pending_orders: number;
  confirmed_orders: number;
  completed_orders: number;
  cancelled_orders: number;
  low_stock_products: number;
}

interface TopProduct {
  product_id: number;
  product_name: string;
  total_sold: number;
  revenue: number;
}

const DashboardPage = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [topProducts, setTopProducts] = useState<TopProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [dashRes, topRes] = await Promise.all([
          apiClient.get("/api/v1/admin/analytics/dashboard"),
          apiClient.get("/api/v1/admin/analytics/top-products?limit=5")
        ]);
        setData(dashRes.data);
        setTopProducts(topRes.data);
      } catch (error) {
        console.error("Failed to fetch dashboard data", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  if (isLoading) return <div>Loading dashboard...</div>;
  if (!data) return <div>Error loading data.</div>;

  const statCards = [
    { title: "Total Revenue", value: `₹${data.total_revenue}`, icon: DollarSign, color: "text-green-600" },
    { title: "Total Orders", value: data.total_orders, icon: ListOrdered, color: "text-blue-600" },
    { title: "Total Customers", value: data.total_customers, icon: Users, color: "text-purple-600" },
    { title: "Active Products", value: data.total_products, icon: ShoppingBag, color: "text-orange-600" },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Dashboard Overview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">{stat.title}</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</h3>
            </div>
            <div className={`p-3 rounded-full bg-gray-50 ${stat.color}`}>
              <stat.icon className="w-6 h-6" />
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Order Status Breakdown</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Pending</span>
              <span className="font-semibold">{data.pending_orders}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Confirmed</span>
              <span className="font-semibold">{data.confirmed_orders}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Completed (Delivered)</span>
              <span className="font-semibold text-green-600">{data.completed_orders}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Cancelled</span>
              <span className="font-semibold text-red-600">{data.cancelled_orders}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4 flex justify-between items-center">
            Top Selling Products
            {data.low_stock_products > 0 && (
              <span className="text-xs flex items-center text-red-600 bg-red-50 px-2 py-1 rounded-full">
                <AlertCircle className="w-3 h-3 mr-1" />
                {data.low_stock_products} Low Stock
              </span>
            )}
          </h2>
          <div className="space-y-4">
            {topProducts.map(product => (
              <div key={product.product_id} className="flex justify-between items-center border-b pb-2 last:border-0">
                <div>
                  <p className="font-medium text-gray-800">{product.product_name}</p>
                  <p className="text-xs text-gray-500">{product.total_sold} units sold</p>
                </div>
                <div className="font-semibold">₹{product.revenue}</div>
              </div>
            ))}
            {topProducts.length === 0 && <p className="text-gray-500 text-sm">No sales data available yet.</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
