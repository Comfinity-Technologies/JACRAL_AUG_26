import { useEffect, useState } from "react";
import { apiClient } from "../../api/client";
import { Plus } from "lucide-react";

interface Category {
  id: number;
  name: string;
  slug: string;
  is_active: boolean;
}

const AdminCategoriesPage = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");

  const fetchCategories = async () => {
    try {
      const res = await apiClient.get("/api/v1/admin/categories");
      setCategories(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiClient.post("/api/v1/admin/categories", { name });
      setName("");
      setShowForm(false);
      fetchCategories();
    } catch (err: any) {
      alert(err.response?.data?.detail || "Failed to create category");
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to deactivate this category?")) return;
    try {
      await apiClient.delete(`/api/v1/admin/categories/${id}`);
      fetchCategories();
    } catch (err) {
      console.error(err);
    }
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Categories</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          <Plus className="w-4 h-4" />
          <span>Add Category</span>
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="bg-white p-6 rounded-lg shadow-sm border flex items-end space-x-4">
          <div className="flex-1">
            <label className="block text-sm font-medium mb-1">Category Name</label>
            <input required type="text" className="w-full border rounded px-3 py-2" value={name} onChange={e => setName(e.target.value)} />
          </div>
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded h-10">Save</button>
        </form>
      )}

      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-x-auto">
        <table className="w-full whitespace-nowrap">
          <thead className="bg-gray-50 text-gray-600 text-left text-sm uppercase">
            <tr>
              <th className="px-6 py-3">Name</th>
              <th className="px-6 py-3">Slug</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {categories.map(c => (
              <tr key={c.id}>
                <td className="px-6 py-4 font-medium">{c.name}</td>
                <td className="px-6 py-4 text-gray-500">{c.slug}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${c.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {c.is_active ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <button onClick={() => handleDelete(c.id)} className="text-red-600 hover:underline">Deactivate</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminCategoriesPage;
