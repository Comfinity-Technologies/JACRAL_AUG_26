import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import ProductGrid from "../../components/customer/ProductGrid";
import { apiClient } from "../../api/client";
import { Trophy } from "lucide-react";

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [topCustomers, setTopCustomers] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const prodRes = await apiClient.get("/api/v1/products?limit=4&featured=true");
        setFeaturedProducts(prodRes.data.items || []);
      } catch (err) {
        console.error("Failed to fetch featured products", err);
      }
      
      try {
        const topRes = await apiClient.get("/api/v1/analytics/top-customers");
        setTopCustomers(topRes.data || []);
      } catch (err) {
        console.error("Failed to fetch top customers", err);
      }
    };
    
    fetchData();
  }, []);

  return (
    <div className="bg-[#FCFAF4] text-[#17382B]">
      {/* HERO */}
      <section className="px-6 py-16 md:py-24">
        <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[#C98B4A]">
              JACRAL
            </p>

            <h1 className="mt-5 max-w-3xl font-serif text-5xl leading-tight md:text-7xl">
              From nature,
              <br />
              to your table.
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-8 text-[#718078]">
              Discover quality jackfruit products and wholesome cereals
              selected for everyday living.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                to="/shop"
                className="rounded-full bg-[#17382B] px-7 py-4 font-semibold text-white transition hover:bg-[#285642]"
              >
                Shop Products
              </Link>

              <Link
                to="/shop"
                className="rounded-full border border-[#17382B] px-7 py-4 font-semibold text-[#17382B] transition hover:bg-[#17382B] hover:text-white"
              >
                Explore Collection
              </Link>
            </div>
          </div>

          <div className="relative">
            <div className="flex min-h-[440px] items-center justify-center rounded-[3rem] bg-[#E9E1D0] p-10">
              <div className="text-center">
                <div className="mx-auto flex h-40 w-40 items-center justify-center rounded-full bg-[#17382B] text-7xl">
                  🌳
                </div>

                <p className="mt-8 text-sm font-semibold uppercase tracking-[0.25em] text-[#C98B4A]">
                  Jackfruit & Cereals
                </p>

                <h2 className="mt-3 font-serif text-4xl">
                  Simple. Natural. Good.
                </h2>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="border-y border-[#E5E0D5] bg-white px-6 py-16">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#C98B4A]">
              SHOP BY CATEGORY
            </p>

            <h2 className="mt-3 font-serif text-4xl text-[#17382B] md:text-5xl">
              What are you looking for?
            </h2>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-2">
            <Link
              to="/shop?category=Jackfruit"
              className="group rounded-3xl bg-[#F1EBDD] p-10 transition hover:-translate-y-1"
            >
              <div className="text-5xl">🌳</div>

              <h3 className="mt-6 font-serif text-4xl text-[#17382B]">
                Jackfruit
              </h3>

              <p className="mt-3 max-w-md leading-7 text-[#718078]">
                Explore jackfruit-based products prepared for convenient
                everyday use.
              </p>

              <span className="mt-6 inline-block font-semibold text-[#17382B]">
                Explore Jackfruit →
              </span>
            </Link>

            <Link
              to="/shop?category=Cereals"
              className="group rounded-3xl bg-[#E7EEE6] p-10 transition hover:-translate-y-1"
            >
              <div className="text-5xl">🌾</div>

              <h3 className="mt-6 font-serif text-4xl text-[#17382B]">
                Cereals
              </h3>

              <p className="mt-3 max-w-md leading-7 text-[#718078]">
                Browse our cereal collection for wholesome everyday meals.
              </p>

              <span className="mt-6 inline-block font-semibold text-[#17382B]">
                Explore Cereals →
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#C98B4A]">
                FEATURED
              </p>

              <h2 className="mt-3 font-serif text-4xl text-[#17382B] md:text-5xl">
                Our products
              </h2>

              <p className="mt-4 max-w-xl text-[#718078]">
                Discover selected products from the Jacral collection.
              </p>
            </div>

            <Link
              to="/shop"
              className="font-semibold text-[#17382B]"
            >
              View all products →
            </Link>
          </div>

          <div className="mt-10">
            {featuredProducts.length > 0 ? (
              <ProductGrid products={featuredProducts} />
            ) : (
              <p className="text-gray-500">Loading products...</p>
            )}
          </div>
        </div>
      </section>

      {/* TOP CUSTOMERS LEADERBOARD */}
      {topCustomers.length > 0 && (
        <section className="bg-white px-6 py-20 border-t border-[#E5E0D5]">
          <div className="mx-auto max-w-4xl">
            <div className="text-center mb-10">
              <div className="mx-auto bg-amber-100 text-amber-600 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                <Trophy className="w-8 h-8" />
              </div>
              <h2 className="font-serif text-4xl text-[#17382B] md:text-5xl">
                Jacral Top Customers
              </h2>
              <p className="mt-4 text-[#718078]">
                Celebrating our top 10 most active members in the Jacral community.
              </p>
            </div>
            
            <div className="bg-[#FCFAF4] rounded-2xl shadow-sm border border-[#E5E0D5] overflow-hidden">
              {topCustomers.map((customer: any, index: number) => (
                <div key={customer.user_id} className="flex items-center px-6 py-4 border-b border-[#E5E0D5] last:border-0 hover:bg-white transition">
                  <div className={`w-10 h-10 flex-shrink-0 rounded-full flex items-center justify-center font-bold mr-4 ${index < 3 ? 'bg-amber-100 text-amber-700' : 'bg-gray-200 text-gray-700'}`}>
                    #{index + 1}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg text-[#17382B]">{customer.name}</h3>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-[#17382B]">{customer.total_orders} Orders</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* BRAND MESSAGE */}
      <section className="bg-[#17382B] px-6 py-20 text-white">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#D8B27D]">
            THE JACRAL APPROACH
          </p>

          <h2 className="mt-5 font-serif text-4xl leading-tight md:text-6xl">
            Products made for
            <br />
            everyday life.
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-white/70">
            Jacral brings its product catalogue, customer experience,
            ordering and business operations together in one connected
            ecommerce platform.
          </p>

          <Link
            to="/shop"
            className="mt-8 inline-block rounded-full bg-white px-7 py-4 font-semibold text-[#17382B] transition hover:bg-[#F1EBDD]"
          >
            Start Shopping
          </Link>
        </div>
      </section>
    </div>
  );
}