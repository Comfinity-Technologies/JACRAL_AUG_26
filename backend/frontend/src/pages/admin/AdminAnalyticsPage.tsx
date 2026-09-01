import { useEffect, useState } from "react";
import { apiClient } from "../../api/client";
import { Trophy, TrendingUp, ShoppingBag, Users, Star } from "lucide-react";

interface TopCustomer {
  user_id: number;
  name: string;
  email: string;
  total_orders: number;
  total_spent: number;
}

interface AnalyticsSummary {
  total_revenue: number;
  total_orders: number;
  total_customers: number;
  pending_orders: number;
  processing_orders: number;
  shipped_orders: number;
  delivered_orders: number;
  top_products: { id: number; name: string; total_sold: number; revenue: number }[];
}

export default function AdminAnalyticsPage() {
  const [topCustomers, setTopCustomers] = useState<TopCustomer[]>([]);
  const [summary, setSummary] = useState<AnalyticsSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [topRes, sumRes] = await Promise.all([
          apiClient.get("/api/v1/analytics/top-customers"),
          apiClient.get("/api/v1/analytics/summary"),
        ]);
        setTopCustomers(topRes.data || []);
        setSummary(sumRes.data || null);
      } catch (err) {
        console.error("Failed to load analytics", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const medals = ["🥇", "🥈", "🥉"];

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center h-64">
        <div className="text-gray-500">Loading analytics...</div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
        <p className="text-gray-500 mt-1">Full platform insights and performance metrics.</p>
      </div>

      {/* Summary Cards */}
      {summary && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="w-5 h-5 text-green-600" />
              <span className="text-sm text-gray-500">Total Revenue</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">
              ₹{summary.total_revenue?.toLocaleString("en-IN") ?? "0"}
            </p>
          </div>
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-2">
              <ShoppingBag className="w-5 h-5 text-blue-600" />
              <span className="text-sm text-gray-500">Total Orders</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{summary.total_orders ?? 0}</p>
          </div>
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-2">
              <Users className="w-5 h-5 text-purple-600" />
              <span className="text-sm text-gray-500">Total Customers</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{summary.total_customers ?? 0}</p>
          </div>
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-2">
              <Star className="w-5 h-5 text-amber-600" />
              <span className="text-sm text-gray-500">Pending Orders</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{summary.pending_orders ?? 0}</p>
          </div>
        </div>
      )}

      {/* Order Status Breakdown */}
      {summary && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Status Breakdown</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Pending", value: summary.pending_orders, color: "bg-yellow-100 text-yellow-800" },
              { label: "Processing", value: summary.processing_orders, color: "bg-blue-100 text-blue-800" },
              { label: "Shipped", value: summary.shipped_orders, color: "bg-purple-100 text-purple-800" },
              { label: "Delivered", value: summary.delivered_orders, color: "bg-green-100 text-green-800" },
            ].map((s) => (
              <div key={s.label} className={`rounded-lg px-4 py-3 text-center ${s.color}`}>
                <p className="text-2xl font-bold">{s.value ?? 0}</p>
                <p className="text-sm font-medium mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-8">
        {/* Top Customers Leaderboard */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center gap-3 mb-6">
            <Trophy className="w-6 h-6 text-amber-500" />
            <h2 className="text-lg font-semibold text-gray-900">Top 10 Customers</h2>
          </div>

          {topCustomers.length === 0 ? (
            <p className="text-gray-400 text-center py-6">No order data yet.</p>
          ) : (
            <div className="space-y-3">
              {topCustomers.map((c, i) => (
                <div
                  key={c.user_id}
                  className="flex items-center justify-between p-3 rounded-lg bg-gray-50"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl w-8 text-center">
                      {i < 3 ? medals[i] : `#${i + 1}`}
                    </span>
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">{c.name}</p>
                      <p className="text-xs text-gray-400">{c.email}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-[#17382B]">
                      ₹{Number(c.total_spent || 0).toLocaleString("en-IN")}
                    </p>
                    <p className="text-xs text-gray-400">{c.total_orders} orders</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Top Products */}
        {summary && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-3 mb-6">
              <ShoppingBag className="w-6 h-6 text-blue-500" />
              <h2 className="text-lg font-semibold text-gray-900">Top Selling Products</h2>
            </div>
            {(!summary.top_products || summary.top_products.length === 0) ? (
              <p className="text-gray-400 text-center py-6">No sales data yet.</p>
            ) : (
              <div className="space-y-3">
                {summary.top_products.map((p, i) => (
                  <div
                    key={p.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-gray-50"
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-gray-400 text-sm w-6">#{i + 1}</span>
                      <p className="font-medium text-gray-900 text-sm">{p.name}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-[#17382B]">
                        ₹{Number(p.revenue || 0).toLocaleString("en-IN")}
                      </p>
                      <p className="text-xs text-gray-400">{p.total_sold} sold</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
