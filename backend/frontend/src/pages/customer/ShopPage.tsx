import { useEffect, useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import ProductGrid from "../../components/customer/ProductGrid";
import { apiClient } from "../../api/client";

export default function ShopPage() {
  const [searchParams] = useSearchParams();
  const initialCategory = searchParams.get("category") || "All";

  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prodRes, catRes] = await Promise.all([
          apiClient.get("/api/v1/products?limit=100"),
          apiClient.get("/api/v1/categories")
        ]);
        setProducts(prodRes.data.items || []);
        setCategories([{ id: "all", name: "All" }, ...catRes.data]);
      } catch (error) {
        console.error("Failed to fetch shop data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesCategory =
        selectedCategory === "All" ||
        (product.category && product.category.name === selectedCategory);

      const searchTerm = search.trim().toLowerCase();

      const matchesSearch =
        searchTerm === "" ||
        product.name.toLowerCase().includes(searchTerm) ||
        (product.description && product.description.toLowerCase().includes(searchTerm));

      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, search, products]);

  if (isLoading) return <div className="min-h-screen bg-[#FCFAF4] flex justify-center items-center">Loading products...</div>;

  return (
    <div className="min-h-screen bg-[#FCFAF4] px-6 py-12 text-[#17382B]">
      <div className="mx-auto max-w-7xl">
        {/* HEADER */}
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#C98B4A]">
            JACRAL SHOP
          </p>

          <h1 className="mt-3 font-serif text-5xl md:text-6xl">
            Our Collection
          </h1>

          <p className="mt-5 text-lg leading-8 text-[#718078]">
            Explore Jacral's jackfruit and cereal products.
          </p>
        </div>

        {/* FILTERS */}
        <div className="mt-10 rounded-3xl border border-[#E5E0D5] bg-white p-5">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            {/* SEARCH */}
            <div className="w-full lg:max-w-md">
              <label
                htmlFor="product-search"
                className="mb-2 block text-sm font-medium text-[#17382B]"
              >
                Search products
              </label>

              <input
                id="product-search"
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search jackfruit or cereals..."
                className="w-full rounded-2xl border border-[#DCD7CB] bg-[#FCFAF4] px-4 py-3 outline-none transition focus:border-[#17382B]"
              />
            </div>

            {/* CATEGORY */}
            <div>
              <p className="mb-2 text-sm font-medium text-[#17382B]">
                Category
              </p>

              <div className="flex flex-wrap gap-2">
                {categories.map((category) => {
                  const active = selectedCategory === category.name;

                  return (
                    <button
                      key={category.id}
                      type="button"
                      onClick={() => setSelectedCategory(category.name)}
                      className={`rounded-full px-5 py-2.5 text-sm font-semibold transition ${
                        active
                          ? "bg-[#17382B] text-white"
                          : "border border-[#DCD7CB] bg-white text-[#17382B] hover:bg-[#F1EBDD]"
                      }`}
                    >
                      {category.name}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* RESULTS */}
        <div className="mt-10 flex items-center justify-between">
          <p className="text-sm text-[#718078]">
            Showing{" "}
            <span className="font-semibold text-[#17382B]">
              {filteredProducts.length}
            </span>{" "}
            {filteredProducts.length === 1 ? "product" : "products"}
          </p>

          {(search || selectedCategory !== "All") && (
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setSelectedCategory("All");
              }}
              className="text-sm font-semibold text-[#17382B] underline underline-offset-4"
            >
              Clear filters
            </button>
          )}
        </div>

        <div className="mt-6">
          {filteredProducts.length > 0 ? (
            <ProductGrid products={filteredProducts} />
          ) : (
            <p className="text-center text-gray-500 py-12">No products found matching your criteria.</p>
          )}
        </div>
      </div>
    </div>
  );
}