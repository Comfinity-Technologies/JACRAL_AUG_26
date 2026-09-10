import { useState, useEffect, useRef } from "react";
import {
  Upload,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  Eye,
  Save,
  Trash2,
  Sparkles,
  Layers,
  FileText,
  ExternalLink,
  Plus,
  Star,
  Globe,
  Phone,
  Mail,
  MapPin,
  Share2,
  Clock,
  ShieldCheck,
  ShoppingBag,
} from "lucide-react";
import {
  getAdminLandingPage,
  uploadBrandLogo,
  removeBrandLogo,
  updateBrandDraft,
  updateSlide,
  uploadSlideImage,
  updateSectionDraft,
  publishLandingPage,
  getSiteSettings,
  updateSiteSettings,
  uploadStepImage,
} from "../../services/landingPageService";
import {
  getAdminReviews,
  createReview,
  updateReview,
  deleteReview,
  publishReview,
  unpublishReview,
} from "../../services/reviewService";
import { getImageUrl } from "../../utils/image";
import type {
  AdminLandingPageData,
  HeroSlideAdmin,
  SiteSettings,
} from "../../types/landingPage";
import type {
  CustomerReviewAdmin,
  ReviewCreateInput,
} from "../../types/review";

type CMSTab = "hero" | "products" | "sections" | "reviews" | "settings";

export default function AdminLandingPageCMS() {
  const [activeTab, setActiveTab] = useState<CMSTab>("hero");
  const [data, setData] = useState<AdminLandingPageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  // Brand and Slides state
  const [brandDraft, setBrandDraft] = useState<{ brand_name: string; tagline: string }>({
    brand_name: "JACRAL",
    tagline: "",
  });
  const [slidesDraft, setSlidesDraft] = useState<HeroSlideAdmin[]>([]);

  // Sections state (How to use)
  const [howToUseDraft, setHowToUseDraft] = useState<any>({
    title: "HOW TO ENJOY",
    subtitle: "EFFORTLESS MORNING NOURISHMENT",
    heading: "Ready in Under 2 Minutes",
    description: "Clean, quick, and customizable. Fuel up the smart way every morning.",
    steps: [
      { step: "01", title: "Pour Cereal", desc: "Add 40–50g of Jacral Jackfruit Cereal into your bowl.", image_url: null },
      { step: "02", title: "Add Milk or Plant Milk", desc: "Pour warm or chilled milk, almond milk, or oat milk.", image_url: null },
      { step: "03", title: "Top & Customize", desc: "Add your favorite fresh berries, nuts, seeds, or honey.", image_url: null },
      { step: "04", title: "Savor & Energize", desc: "Enjoy crisp texture and clean, steady energy that powers your day.", image_url: null },
    ],
  });

  // Products Section CMS State
  const [productsSectionDraft, setProductsSectionDraft] = useState({
    title: "OUR PRODUCTS",
    subtitle: "Discover the goodness of jackfruit, crafted for everyday living.",
    badge_text: "NATURE'S HARVEST INNOVATION",
    protein_claim: "20% PROTEIN",
    fiber_claim: "25% FIBER",
    sugar_claim: "0 ADDED SUGAR",
    trust_badge_1: "100% Clean Jackfruit",
    trust_badge_2: "No Artificial Preservatives",
    trust_badge_3: "Ancient Indian Millets",
    shop_cta_text: "View Full Shop",
  });

  // Reviews state
  const [reviews, setReviews] = useState<CustomerReviewAdmin[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [newReviewModal, setNewReviewModal] = useState(false);
  const [newReviewForm, setNewReviewForm] = useState<ReviewCreateInput>({
    customer_name: "",
    customer_location: "",
    review_text: "",
    rating: 5,
    display_order: 1,
    is_active: true,
    is_published: true,
  });

  // Site settings state
  const [settingsDraft, setSettingsDraft] = useState<SiteSettings>({
    contact_email: "",
    contact_phone: "",
    contact_address: "",
    social_instagram: "",
    social_facebook: "",
    social_twitter: "",
    social_linkedin: "",
  });

  const logoInputRef = useRef<HTMLInputElement>(null);
  const slideFileInputs = useRef<Record<string, HTMLInputElement | null>>({});
  const stepFileInputs = useRef<Record<number, HTMLInputElement | null>>({});

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const loadData = async () => {
    try {
      setLoading(true);
      const [cmsRes, settingsRes, reviewsRes] = await Promise.all([
        getAdminLandingPage(),
        getSiteSettings().catch(() => ({})),
        getAdminReviews().catch(() => []),
      ]);

      setData(cmsRes);
      setBrandDraft({
        brand_name: cmsRes.brand.brand_name || "JACRAL",
        tagline: cmsRes.brand.tagline || "",
      });
      setSlidesDraft(cmsRes.hero_slides || []);

      if (cmsRes.sections?.["how_to_use"]) {
        const sec = cmsRes.sections["how_to_use"];
        const content = sec.draft_content || sec.content || {};
        setHowToUseDraft({
          title: sec.title || "HOW TO ENJOY",
          subtitle: sec.subtitle || "EFFORTLESS MORNING NOURISHMENT",
          heading: content.heading || "Ready in Under 2 Minutes",
          description: content.description || "Clean, quick, and customizable.",
          steps: content.steps || howToUseDraft.steps,
        });
      }

      if (cmsRes.sections?.["products_section"]) {
        const sec = cmsRes.sections["products_section"];
        const content = sec.draft_content || sec.content || {};
        setProductsSectionDraft({
          title: sec.title || "OUR PRODUCTS",
          subtitle: sec.subtitle || "Discover the goodness of jackfruit, crafted for everyday living.",
          badge_text: content.badge_text || "NATURE'S HARVEST INNOVATION",
          protein_claim: content.protein_claim || "20% PROTEIN",
          fiber_claim: content.fiber_claim || "25% FIBER",
          sugar_claim: content.sugar_claim || "0 ADDED SUGAR",
          trust_badge_1: content.trust_badge_1 || "100% Clean Jackfruit",
          trust_badge_2: content.trust_badge_2 || "No Artificial Preservatives",
          trust_badge_3: content.trust_badge_3 || "Ancient Indian Millets",
          shop_cta_text: content.shop_cta_text || "View Full Shop",
        });
      }

      if (settingsRes) {
        setSettingsDraft(settingsRes);
      }

      setReviews(reviewsRes);
    } catch (err: any) {
      console.error("Failed to load CMS data:", err);
      showToast("Failed to load CMS content", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Handle Logo Upload
  const handleLogoFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setSaving(true);
      const res = await uploadBrandLogo(file);
      showToast("Brand logo uploaded! Don't forget to publish changes.");
      loadData();
    } catch (err: any) {
      console.error("Logo upload error:", err);
      showToast("Failed to upload brand logo", "error");
    } finally {
      setSaving(false);
    }
  };

  // Handle Logo Remove
  const handleRemoveLogo = async () => {
    try {
      setSaving(true);
      await removeBrandLogo();
      showToast("Brand logo removed. Publish to apply to live site.");
      loadData();
    } catch (err: any) {
      console.error("Remove logo error:", err);
      showToast("Failed to remove logo", "error");
    } finally {
      setSaving(false);
    }
  };

  // Handle Slide Text Change
  const handleSlideChange = (index: number, field: keyof HeroSlideAdmin, value: any) => {
    setSlidesDraft((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  // Handle Slide Image Upload
  const handleSlideImageUpload = async (slideId: number, target: "desktop" | "mobile", file: File) => {
    try {
      setSaving(true);
      await uploadSlideImage(slideId, file, target);
      showToast(`Slide #${slideId} ${target} image uploaded!`);
      loadData();
    } catch (err: any) {
      console.error("Slide image upload error:", err);
      showToast("Failed to upload slide image", "error");
    } finally {
      setSaving(false);
    }
  };

  // Handle Step Image Upload
  const handleStepImageUpload = async (stepIndex: number, file: File) => {
    try {
      setSaving(true);
      const res = await uploadStepImage(stepIndex + 1, file);  // 1-indexed
      const newImageUrl = res.image_url;

      setHowToUseDraft((prev: any) => {
        const steps = [...prev.steps];
        steps[stepIndex] = { ...steps[stepIndex], image_url: newImageUrl };
        return { ...prev, steps };
      });

      showToast(`Step ${stepIndex + 1} image uploaded! Save Draft to keep changes.`);
    } catch (err: any) {
      console.error("Step image upload error:", err);
      showToast("Step image upload failed", "error");
    } finally {
      setSaving(false);
    }
  };

  // Save All Drafts
  const handleSaveDraft = async () => {
    try {
      setSaving(true);
      // 1. Brand Draft
      await updateBrandDraft(brandDraft);

      // 2. Slides Draft
      for (const slide of slidesDraft) {
        await updateSlide(slide.id, {
          title: slide.draft_title,
          subtitle: slide.draft_subtitle,
          description: slide.draft_description,
          cta_text: slide.draft_cta_text,
          cta_url: slide.draft_cta_url,
          secondary_cta_text: slide.draft_secondary_cta_text,
          secondary_cta_url: slide.draft_secondary_cta_url,
          display_order: slide.display_order,
          is_active: slide.draft_is_active,
        });
      }

      // 3. How to Use Section Draft
      await updateSectionDraft("how_to_use", {
        title: howToUseDraft.title,
        subtitle: howToUseDraft.subtitle,
        content: {
          heading: howToUseDraft.heading,
          description: howToUseDraft.description,
          steps: howToUseDraft.steps,
        },
        is_active: true,
      });

      // 4. Products Section Draft
      await updateSectionDraft("products_section", {
        title: productsSectionDraft.title,
        subtitle: productsSectionDraft.subtitle,
        content: {
          badge_text: productsSectionDraft.badge_text,
          protein_claim: productsSectionDraft.protein_claim,
          fiber_claim: productsSectionDraft.fiber_claim,
          sugar_claim: productsSectionDraft.sugar_claim,
          trust_badge_1: productsSectionDraft.trust_badge_1,
          trust_badge_2: productsSectionDraft.trust_badge_2,
          trust_badge_3: productsSectionDraft.trust_badge_3,
          shop_cta_text: productsSectionDraft.shop_cta_text,
        },
        is_active: true,
      });

      // 5. Site Settings Draft
      await updateSiteSettings(settingsDraft as any);

      showToast("All drafts saved successfully!");
      await loadData();
    } catch (err: any) {
      console.error("Save draft error:", err);
      showToast("Failed to save changes", "error");
    } finally {
      setSaving(false);
    }
  };

  // Publish All Live
  const handlePublishLive = async () => {
    if (!window.confirm("Publish all pending CMS changes live to customer website?")) return;
    try {
      setPublishing(true);
      // Save drafts first to capture unsaved edits
      await handleSaveDraft();
      const res = await publishLandingPage();
      showToast(res?.message || "Changes are now live!");
      await loadData();
    } catch (err: any) {
      console.error("Publish error:", err);
      showToast("Publish failed", "error");
    } finally {
      setPublishing(false);
    }
  };

  // Reviews actions
  const handleCreateReview = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      await createReview(newReviewForm);
      showToast("Review created successfully!");
      setNewReviewModal(false);
      setNewReviewForm({
        customer_name: "",
        customer_location: "",
        review_text: "",
        rating: 5,
        display_order: reviews.length + 1,
        is_active: true,
        is_published: true,
      });
      const revs = await getAdminReviews();
      setReviews(revs);
    } catch (err: any) {
      console.error("Create review error:", err);
      showToast(err?.response?.data?.detail || "Failed to create review", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleTogglePublishReview = async (rev: CustomerReviewAdmin) => {
    try {
      if (rev.is_published) {
        await unpublishReview(rev.id);
        showToast("Review unpublished");
      } else {
        await publishReview(rev.id);
        showToast("Review published live!");
      }
      const revs = await getAdminReviews();
      setReviews(revs);
    } catch (err) {
      showToast("Failed to toggle review publication", "error");
    }
  };

  const handleDeleteReview = async (id: number) => {
    if (!window.confirm("Delete this review?")) return;
    try {
      await deleteReview(id);
      showToast("Review deleted");
      const revs = await getAdminReviews();
      setReviews(revs);
    } catch (err) {
      showToast("Failed to delete review", "error");
    }
  };

  if (loading) {
    return (
      <div className="p-8 max-w-6xl mx-auto space-y-6">
        <div className="h-10 w-64 bg-[#E5DCDB]/50 rounded-xl animate-pulse" />
        <div className="h-48 bg-[#E5DCDB]/30 rounded-3xl animate-pulse" />
      </div>
    );
  }

  const brand = data?.brand;
  const activeLogoUrl = brand?.draft_logo_url || brand?.logo_url;
  const hasPending = data?.has_unpublished_changes;

  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto space-y-8 pb-28">

      {/* ── TOAST NOTIFICATION ── */}
      {toast && (
        <div
          className={`fixed top-6 right-6 z-50 px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 text-xs font-bold uppercase tracking-wider animate-slideDown ${
            toast.type === "success"
              ? "bg-[#3B6E4C] text-white"
              : "bg-[#D93333] text-white"
          }`}
        >
          {toast.type === "success" ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
          <span>{toast.message}</span>
        </div>
      )}

      {/* ── HEADER & WORKFLOW ACTION BAR ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#E5DCDB]">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#3B6E4C]">
            <span>Admin</span>
            <span>/</span>
            <span>Content Management</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black uppercase text-[#2C221E] mt-1">
            HOMEPAGE CMS & SETTINGS
          </h1>
          <div className="flex items-center gap-2 mt-1.5">
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-black uppercase tracking-wider ${
                hasPending
                  ? "bg-[#FFB800]/20 text-[#B38300]"
                  : "bg-[#3B6E4C]/15 text-[#3B6E4C]"
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${hasPending ? "bg-[#FFB800]" : "bg-[#3B6E4C]"}`} />
              {hasPending ? "Draft Changes Pending" : "All Changes Published Live"}
            </span>
            <span className="text-xs text-[#685B55]">
              Edits save as draft. Customer website renders published content.
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleSaveDraft}
            disabled={saving || publishing}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-[#2C221E]/20 bg-white text-[#2C221E] text-xs font-bold uppercase tracking-wider hover:bg-[#FAF6EE] transition-all shadow-sm"
          >
            <Save size={15} />
            <span>{saving ? "Saving..." : "Save Draft"}</span>
          </button>

          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-[#3B6E4C]/30 bg-[#3B6E4C]/10 text-[#3B6E4C] text-xs font-bold uppercase tracking-wider hover:bg-[#3B6E4C]/20 transition-all"
          >
            <Eye size={15} />
            <span>View Live Site</span>
            <ExternalLink size={12} />
          </a>

          <button
            type="button"
            onClick={handlePublishLive}
            disabled={publishing || saving}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#E88D36] text-white text-xs font-black uppercase tracking-wider hover:bg-[#D47E2A] transition-all shadow-lg shadow-[#E88D36]/25"
          >
            <Sparkles size={15} />
            <span>{publishing ? "Publishing..." : "PUBLISH LIVE"}</span>
          </button>
        </div>
      </div>

      {/* ── TABS NAVIGATION ── */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 bg-[#FAF6EE] border border-[#E5DCDB] rounded-2xl">
        <button
          onClick={() => setActiveTab("hero")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
            activeTab === "hero"
              ? "bg-white text-[#2C221E] shadow-sm"
              : "text-[#685B55] hover:text-[#2C221E]"
          }`}
        >
          <Layers size={15} className={activeTab === "hero" ? "text-[#E88D36]" : ""} />
          <span>Hero & Brand</span>
        </button>

        <button
          onClick={() => setActiveTab("products")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
            activeTab === "products"
              ? "bg-white text-[#2C221E] shadow-sm"
              : "text-[#685B55] hover:text-[#2C221E]"
          }`}
        >
          <ShoppingBag size={15} className={activeTab === "products" ? "text-[#E88D36]" : ""} />
          <span>Products Section</span>
        </button>

        <button
          onClick={() => setActiveTab("sections")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
            activeTab === "sections"
              ? "bg-white text-[#2C221E] shadow-sm"
              : "text-[#685B55] hover:text-[#2C221E]"
          }`}
        >
          <FileText size={15} className={activeTab === "sections" ? "text-[#E88D36]" : ""} />
          <span>How To Enjoy Guide</span>
        </button>

        <button
          onClick={() => setActiveTab("reviews")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
            activeTab === "reviews"
              ? "bg-white text-[#2C221E] shadow-sm"
              : "text-[#685B55] hover:text-[#2C221E]"
          }`}
        >
          <Star size={15} className={activeTab === "reviews" ? "text-[#E88D36]" : ""} />
          <span>Customer Reviews ({reviews.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("settings")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
            activeTab === "settings"
              ? "bg-white text-[#2C221E] shadow-sm"
              : "text-[#685B55] hover:text-[#2C221E]"
          }`}
        >
          <Globe size={15} className={activeTab === "settings" ? "text-[#E88D36]" : ""} />
          <span>Site Settings</span>
        </button>
      </div>

      {/* ── TAB 1: HERO & BRAND ── */}
      {activeTab === "hero" && (
        <div className="space-y-8">
          {/* Brand Logo & Identity Card */}
          <div className="rounded-3xl bg-white border border-[#E5DCDB] p-6 md:p-8 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-black uppercase text-[#2C221E] tracking-tight">
                BRAND LOGO & IDENTITY
              </h2>
              <span className="text-[11px] font-bold text-[#685B55] uppercase tracking-wider">
                Controls Customer Navbar & Favicon
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start pt-2">
              <div className="md:col-span-5 space-y-4">
                <p className="text-xs font-bold uppercase tracking-wider text-[#2C221E]">
                  Current Logo
                </p>
                <div className="w-full h-32 rounded-2xl border-2 border-dashed border-[#E5DCDB] bg-[#FAF6EE] flex items-center justify-center p-4 relative overflow-hidden group">
                  {activeLogoUrl ? (
                    <img
                      src={getImageUrl(activeLogoUrl)}
                      alt="Brand Logo"
                      className="max-h-full max-w-full object-contain filter drop-shadow"
                    />
                  ) : (
                    <div className="text-center text-[#685B55] space-y-1">
                      <ImageIcon size={24} className="mx-auto text-[#E88D36]" />
                      <p className="text-xs font-bold uppercase tracking-wider">No Logo Uploaded</p>
                      <p className="text-[10px]">Navbar renders text mark</p>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <input
                    ref={logoInputRef}
                    type="file"
                    accept="image/png,image/jpeg,image/webp,image/svg+xml"
                    onChange={handleLogoFileChange}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => logoInputRef.current?.click()}
                    disabled={saving}
                    className="flex-1 py-2 px-4 rounded-xl border border-[#2C221E]/20 bg-white text-xs font-bold uppercase tracking-wider hover:bg-[#FAF6EE] transition flex items-center justify-center gap-2"
                  >
                    <Upload size={14} />
                    <span>Upload Logo</span>
                  </button>

                  {activeLogoUrl && (
                    <button
                      type="button"
                      onClick={handleRemoveLogo}
                      disabled={saving}
                      className="p-2 rounded-xl border border-[#D93333]/30 text-[#D93333] hover:bg-[#D93333]/10 transition"
                      title="Remove Logo"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              </div>

              <div className="md:col-span-7 space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#2C221E] mb-1.5">
                    Brand Name
                  </label>
                  <input
                    type="text"
                    value={brandDraft.brand_name}
                    onChange={(e) =>
                      setBrandDraft((prev) => ({ ...prev, brand_name: e.target.value }))
                    }
                    className="w-full px-4 py-2.5 rounded-xl border border-[#E5DCDB] text-sm font-semibold text-[#2C221E] focus:outline-none focus:border-[#E88D36]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#2C221E] mb-1.5">
                    Brand Tagline
                  </label>
                  <input
                    type="text"
                    value={brandDraft.tagline}
                    onChange={(e) =>
                      setBrandDraft((prev) => ({ ...prev, tagline: e.target.value }))
                    }
                    placeholder="e.g. 100% Unripe Jackfruit Innovation"
                    className="w-full px-4 py-2.5 rounded-xl border border-[#E5DCDB] text-sm font-semibold text-[#2C221E] focus:outline-none focus:border-[#E88D36]"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Hero Slides */}
          <div className="rounded-3xl bg-white border border-[#E5DCDB] p-6 md:p-8 shadow-sm space-y-6">
            <h2 className="text-lg font-black uppercase text-[#2C221E] tracking-tight">
              HERO SLIDES (3 ADMIN-CONTROLLED SLIDES)
            </h2>

            <div className="space-y-6">
              {slidesDraft.map((slide, index) => {
                const img = slide.draft_image_url || slide.image_url;
                return (
                  <div
                    key={slide.id}
                    className="p-6 rounded-2xl border border-[#E5DCDB] bg-[#FAF6EE]/50 space-y-5"
                  >
                    <div className="flex items-center justify-between pb-3 border-b border-[#E5DCDB]">
                      <span className="text-xs font-black uppercase tracking-wider text-[#3B6E4C]">
                        SLIDE {slide.slide_number}
                      </span>
                      <label className="flex items-center gap-2 text-xs font-bold text-[#2C221E] cursor-pointer">
                        <input
                          type="checkbox"
                          checked={slide.draft_is_active}
                          onChange={(e) =>
                            handleSlideChange(index, "draft_is_active", e.target.checked)
                          }
                          className="rounded text-[#3B6E4C] focus:ring-[#3B6E4C]"
                        />
                        <span>Active</span>
                      </label>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                      <div className="md:col-span-4 space-y-3">
                        <p className="text-[11px] font-bold uppercase tracking-wider text-[#685B55]">
                          Slide Image
                        </p>
                        <div className="w-full h-36 rounded-2xl border-2 border-dashed border-[#E5DCDB] bg-white flex items-center justify-center p-3 relative overflow-hidden">
                          {img ? (
                            <img
                              src={getImageUrl(img)}
                              alt={`Slide ${slide.slide_number}`}
                              className="max-h-full max-w-full object-contain"
                            />
                          ) : (
                            <div className="text-center text-[#685B55]">
                              <ImageIcon size={20} className="mx-auto text-[#E88D36] mb-1" />
                              <span className="text-[10px] uppercase font-bold">No Image</span>
                            </div>
                          )}
                        </div>

                        <input
                          ref={(el) => {
                            slideFileInputs.current[`${slide.id}-desktop`] = el;
                          }}
                          type="file"
                          accept="image/png,image/jpeg,image/webp"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleSlideImageUpload(slide.id, "desktop", file);
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => slideFileInputs.current[`${slide.id}-desktop`]?.click()}
                          className="w-full py-2 px-3 rounded-xl border border-[#2C221E]/20 bg-white text-xs font-bold uppercase tracking-wider hover:bg-[#FAF6EE] flex items-center justify-center gap-2"
                        >
                          <Upload size={13} />
                          <span>Change Image</span>
                        </button>
                      </div>

                      <div className="md:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="sm:col-span-2">
                          <label className="block text-[11px] font-bold uppercase tracking-wider text-[#2C221E] mb-1">
                            Slide Headline
                          </label>
                          <input
                            type="text"
                            value={slide.draft_title || ""}
                            onChange={(e) =>
                              handleSlideChange(index, "draft_title", e.target.value)
                            }
                            className="w-full px-3.5 py-2 rounded-xl border border-[#E5DCDB] text-xs font-bold text-[#2C221E] focus:outline-none focus:border-[#E88D36]"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold uppercase tracking-wider text-[#2C221E] mb-1">
                            Subtitle Badge
                          </label>
                          <input
                            type="text"
                            value={slide.draft_subtitle || ""}
                            onChange={(e) =>
                              handleSlideChange(index, "draft_subtitle", e.target.value)
                            }
                            className="w-full px-3.5 py-2 rounded-xl border border-[#E5DCDB] text-xs font-medium text-[#2C221E] focus:outline-none focus:border-[#E88D36]"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold uppercase tracking-wider text-[#2C221E] mb-1">
                            Display Order
                          </label>
                          <input
                            type="number"
                            value={slide.display_order || index + 1}
                            onChange={(e) =>
                              handleSlideChange(index, "display_order", parseInt(e.target.value) || 1)
                            }
                            className="w-full px-3.5 py-2 rounded-xl border border-[#E5DCDB] text-xs font-medium text-[#2C221E] focus:outline-none focus:border-[#E88D36]"
                          />
                        </div>

                        <div className="sm:col-span-2">
                          <label className="block text-[11px] font-bold uppercase tracking-wider text-[#2C221E] mb-1">
                            Description
                          </label>
                          <textarea
                            rows={2}
                            value={slide.draft_description || ""}
                            onChange={(e) =>
                              handleSlideChange(index, "draft_description", e.target.value)
                            }
                            className="w-full px-3.5 py-2 rounded-xl border border-[#E5DCDB] text-xs font-medium text-[#2C221E] focus:outline-none focus:border-[#E88D36]"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold uppercase tracking-wider text-[#2C221E] mb-1">
                            CTA Button Text
                          </label>
                          <input
                            type="text"
                            value={slide.draft_cta_text || ""}
                            onChange={(e) =>
                              handleSlideChange(index, "draft_cta_text", e.target.value)
                            }
                            className="w-full px-3.5 py-2 rounded-xl border border-[#E5DCDB] text-xs font-medium text-[#2C221E] focus:outline-none focus:border-[#E88D36]"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold uppercase tracking-wider text-[#2C221E] mb-1">
                            CTA Button URL
                          </label>
                          <input
                            type="text"
                            value={slide.draft_cta_url || ""}
                            onChange={(e) =>
                              handleSlideChange(index, "draft_cta_url", e.target.value)
                            }
                            className="w-full px-3.5 py-2 rounded-xl border border-[#E5DCDB] text-xs font-medium text-[#2C221E] focus:outline-none focus:border-[#E88D36]"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ── TAB: PRODUCTS SECTION ── */}
      {activeTab === "products" && (
        <div className="space-y-6">
          {/* Header */}
          <div className="rounded-3xl bg-white border border-[#E5DCDB] p-6 md:p-8 shadow-sm space-y-6">
            <div>
              <h2 className="text-lg font-black uppercase text-[#2C221E] tracking-tight">
                PRODUCTS SECTION COPY
              </h2>
              <p className="text-xs text-[#685B55] mt-1">
                Edit the heading, subtitle, and badge text shown in the "Our Products" carousel on the homepage.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-[#2C221E] mb-1.5">
                  Section Heading
                </label>
                <input
                  type="text"
                  value={productsSectionDraft.title}
                  onChange={(e) =>
                    setProductsSectionDraft((prev) => ({ ...prev, title: e.target.value }))
                  }
                  placeholder="e.g. OUR PRODUCTS"
                  className="w-full px-4 py-2.5 rounded-xl border border-[#E5DCDB] text-sm font-black text-[#2C221E] focus:outline-none focus:border-[#E88D36]"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-[#2C221E] mb-1.5">
                  Section Subtitle
                </label>
                <input
                  type="text"
                  value={productsSectionDraft.subtitle}
                  onChange={(e) =>
                    setProductsSectionDraft((prev) => ({ ...prev, subtitle: e.target.value }))
                  }
                  placeholder="e.g. Discover the goodness of jackfruit..."
                  className="w-full px-4 py-2.5 rounded-xl border border-[#E5DCDB] text-xs font-medium text-[#2C221E] focus:outline-none focus:border-[#E88D36]"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-[#2C221E] mb-1.5">
                  Top Badge Text
                </label>
                <input
                  type="text"
                  value={productsSectionDraft.badge_text}
                  onChange={(e) =>
                    setProductsSectionDraft((prev) => ({ ...prev, badge_text: e.target.value }))
                  }
                  placeholder="e.g. NATURE'S HARVEST INNOVATION"
                  className="w-full px-4 py-2.5 rounded-xl border border-[#E5DCDB] text-xs font-bold text-[#2C221E] focus:outline-none focus:border-[#E88D36]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#2C221E] mb-1.5">
                  Shop CTA Button Text
                </label>
                <input
                  type="text"
                  value={productsSectionDraft.shop_cta_text}
                  onChange={(e) =>
                    setProductsSectionDraft((prev) => ({ ...prev, shop_cta_text: e.target.value }))
                  }
                  placeholder="e.g. View Full Shop"
                  className="w-full px-4 py-2.5 rounded-xl border border-[#E5DCDB] text-xs font-medium text-[#2C221E] focus:outline-none focus:border-[#E88D36]"
                />
              </div>
            </div>
          </div>

          {/* Nutritional Claims */}
          <div className="rounded-3xl bg-white border border-[#E5DCDB] p-6 md:p-8 shadow-sm space-y-5">
            <div>
              <h3 className="text-sm font-black uppercase text-[#2C221E] tracking-tight">
                NUTRITIONAL CLAIMS (Product Card Badges)
              </h3>
              <p className="text-xs text-[#685B55] mt-1">
                These short labels appear as badges on each product card in the carousel.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#2C221E] mb-1.5">
                  Protein Claim
                </label>
                <input
                  type="text"
                  value={productsSectionDraft.protein_claim}
                  onChange={(e) =>
                    setProductsSectionDraft((prev) => ({ ...prev, protein_claim: e.target.value }))
                  }
                  placeholder="e.g. 20% PROTEIN"
                  className="w-full px-4 py-2.5 rounded-xl border border-[#E5DCDB] text-xs font-bold text-[#2C221E] focus:outline-none focus:border-[#E88D36]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#2C221E] mb-1.5">
                  Fiber Claim
                </label>
                <input
                  type="text"
                  value={productsSectionDraft.fiber_claim}
                  onChange={(e) =>
                    setProductsSectionDraft((prev) => ({ ...prev, fiber_claim: e.target.value }))
                  }
                  placeholder="e.g. 25% FIBER"
                  className="w-full px-4 py-2.5 rounded-xl border border-[#E5DCDB] text-xs font-bold text-[#2C221E] focus:outline-none focus:border-[#E88D36]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#2C221E] mb-1.5">
                  Sugar Claim
                </label>
                <input
                  type="text"
                  value={productsSectionDraft.sugar_claim}
                  onChange={(e) =>
                    setProductsSectionDraft((prev) => ({ ...prev, sugar_claim: e.target.value }))
                  }
                  placeholder="e.g. 0 ADDED SUGAR"
                  className="w-full px-4 py-2.5 rounded-xl border border-[#E5DCDB] text-xs font-bold text-[#2C221E] focus:outline-none focus:border-[#E88D36]"
                />
              </div>
            </div>
          </div>

          {/* Trust Badges */}
          <div className="rounded-3xl bg-white border border-[#E5DCDB] p-6 md:p-8 shadow-sm space-y-5">
            <div>
              <h3 className="text-sm font-black uppercase text-[#2C221E] tracking-tight">
                TRUST BADGES (Section Footer)
              </h3>
              <p className="text-xs text-[#685B55] mt-1">
                Short trust lines displayed below the carousel — highlights quality commitments.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#2C221E] mb-1.5">
                  Trust Badge 1
                </label>
                <input
                  type="text"
                  value={productsSectionDraft.trust_badge_1}
                  onChange={(e) =>
                    setProductsSectionDraft((prev) => ({ ...prev, trust_badge_1: e.target.value }))
                  }
                  placeholder="e.g. 100% Clean Jackfruit"
                  className="w-full px-4 py-2.5 rounded-xl border border-[#E5DCDB] text-xs font-medium text-[#2C221E] focus:outline-none focus:border-[#E88D36]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#2C221E] mb-1.5">
                  Trust Badge 2
                </label>
                <input
                  type="text"
                  value={productsSectionDraft.trust_badge_2}
                  onChange={(e) =>
                    setProductsSectionDraft((prev) => ({ ...prev, trust_badge_2: e.target.value }))
                  }
                  placeholder="e.g. No Artificial Preservatives"
                  className="w-full px-4 py-2.5 rounded-xl border border-[#E5DCDB] text-xs font-medium text-[#2C221E] focus:outline-none focus:border-[#E88D36]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#2C221E] mb-1.5">
                  Trust Badge 3
                </label>
                <input
                  type="text"
                  value={productsSectionDraft.trust_badge_3}
                  onChange={(e) =>
                    setProductsSectionDraft((prev) => ({ ...prev, trust_badge_3: e.target.value }))
                  }
                  placeholder="e.g. Ancient Indian Millets"
                  className="w-full px-4 py-2.5 rounded-xl border border-[#E5DCDB] text-xs font-medium text-[#2C221E] focus:outline-none focus:border-[#E88D36]"
                />
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="button"
                onClick={handleSaveDraft}
                disabled={saving}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#3B6E4C] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#2E583C] transition shadow"
              >
                <Save size={14} />
                <span>{saving ? "Saving..." : "Save Products Section Draft"}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── TAB 2: HOW TO ENJOY GUIDE ── */}
      {activeTab === "sections" && (
        <div className="rounded-3xl bg-white border border-[#E5DCDB] p-6 md:p-8 shadow-sm space-y-6">
          <div>
            <h2 className="text-lg font-black uppercase text-[#2C221E] tracking-tight">
              HOW TO ENJOY SECTION CONFIGURATION
            </h2>
            <p className="text-xs text-[#685B55] mt-1">
              Configure step-by-step instructions and optional custom images for breakfast preparation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#2C221E] mb-1.5">
                Section Title
              </label>
              <input
                type="text"
                value={howToUseDraft.title}
                onChange={(e) =>
                  setHowToUseDraft((prev: any) => ({ ...prev, title: e.target.value }))
                }
                className="w-full px-4 py-2.5 rounded-xl border border-[#E5DCDB] text-xs font-bold text-[#2C221E] focus:outline-none focus:border-[#E88D36]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#2C221E] mb-1.5">
                Section Subtitle
              </label>
              <input
                type="text"
                value={howToUseDraft.subtitle}
                onChange={(e) =>
                  setHowToUseDraft((prev: any) => ({ ...prev, subtitle: e.target.value }))
                }
                className="w-full px-4 py-2.5 rounded-xl border border-[#E5DCDB] text-xs font-medium text-[#2C221E] focus:outline-none focus:border-[#E88D36]"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#2C221E] mb-1.5">
                Description
              </label>
              <input
                type="text"
                value={howToUseDraft.description}
                onChange={(e) =>
                  setHowToUseDraft((prev: any) => ({ ...prev, description: e.target.value }))
                }
                className="w-full px-4 py-2.5 rounded-xl border border-[#E5DCDB] text-xs font-medium text-[#2C221E] focus:outline-none focus:border-[#E88D36]"
              />
            </div>
          </div>

          {/* Steps */}
          <div className="space-y-4 pt-4 border-t border-[#E5DCDB]">
            <h3 className="text-xs font-black uppercase tracking-wider text-[#3B6E4C]">
              Preparation Steps (4 Steps)
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {howToUseDraft.steps.map((stepItem: any, sIdx: number) => {
                const stepImg = stepItem.image_url ? getImageUrl(stepItem.image_url) : null;
                return (
                  <div
                    key={sIdx}
                    className="p-5 rounded-2xl bg-[#FAF6EE]/70 border border-[#E5DCDB] space-y-4"
                  >
                    <div className="flex items-center justify-between">
                      <span className="w-7 h-7 rounded-xl bg-[#3B6E4C] text-white text-xs font-black flex items-center justify-center">
                        {stepItem.step || `0${sIdx + 1}`}
                      </span>
                      <span className="text-[11px] font-bold text-[#685B55] uppercase">
                        Step {sIdx + 1}
                      </span>
                    </div>

                    {/* Step Image Upload */}
                    <div className="flex items-center gap-4">
                      <div className="w-20 h-20 rounded-xl bg-white border border-[#E5DCDB] flex items-center justify-center overflow-hidden flex-shrink-0">
                        {stepImg ? (
                          <img src={stepImg} alt={stepItem.title} className="w-full h-full object-cover" />
                        ) : (
                          <ImageIcon size={20} className="text-[#685B55]/40" />
                        )}
                      </div>

                      <div className="flex-1">
                        <input
                          ref={(el) => {
                            stepFileInputs.current[sIdx] = el;
                          }}
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleStepImageUpload(sIdx, file);
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => stepFileInputs.current[sIdx]?.click()}
                          className="px-3 py-1.5 rounded-lg border border-[#2C221E]/20 bg-white text-[11px] font-bold uppercase tracking-wider hover:bg-[#FAF6EE] flex items-center gap-1.5"
                        >
                          <Upload size={12} />
                          <span>{stepImg ? "Replace Image" : "Add Image"}</span>
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold uppercase text-[#2C221E] mb-1">
                        Step Title
                      </label>
                      <input
                        type="text"
                        value={stepItem.title}
                        onChange={(e) => {
                          const updated = [...howToUseDraft.steps];
                          updated[sIdx] = { ...updated[sIdx], title: e.target.value };
                          setHowToUseDraft((prev: any) => ({ ...prev, steps: updated }));
                        }}
                        className="w-full px-3 py-1.5 rounded-xl border border-[#E5DCDB] text-xs font-bold text-[#2C221E]"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold uppercase text-[#2C221E] mb-1">
                        Step Instructions
                      </label>
                      <textarea
                        rows={2}
                        value={stepItem.desc || stepItem.description}
                        onChange={(e) => {
                          const updated = [...howToUseDraft.steps];
                          updated[sIdx] = { ...updated[sIdx], desc: e.target.value };
                          setHowToUseDraft((prev: any) => ({ ...prev, steps: updated }));
                        }}
                        className="w-full px-3 py-1.5 rounded-xl border border-[#E5DCDB] text-xs font-medium text-[#2C221E]"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ── TAB 3: CUSTOMER REVIEWS ── */}
      {activeTab === "reviews" && (
        <div className="rounded-3xl bg-white border border-[#E5DCDB] p-6 md:p-8 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-black uppercase text-[#2C221E] tracking-tight">
                CUSTOMER REVIEWS MANAGEMENT
              </h2>
              <p className="text-xs text-[#685B55] mt-1">
                Manage reviews displayed in the homepage Customer Reviews section. Only published reviews appear live.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setNewReviewModal(true)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#3B6E4C] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#2E583C] transition shadow"
            >
              <Plus size={15} />
              <span>Add New Review</span>
            </button>
          </div>

          {/* Reviews List */}
          <div className="space-y-4">
            {reviews.length === 0 ? (
              <div className="p-12 text-center text-[#685B55] border-2 border-dashed border-[#E5DCDB] rounded-2xl">
                <Star size={32} className="mx-auto text-[#FFB800] mb-2" />
                <p className="font-bold uppercase text-xs">No Reviews Yet</p>
                <p className="text-xs text-[#685B55] mt-1">Click "Add New Review" to add genuine customer testimonials.</p>
              </div>
            ) : (
              reviews.map((rev) => (
                <div
                  key={rev.id}
                  className="p-5 rounded-2xl border border-[#E5DCDB] bg-[#FAF6EE]/50 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                >
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-0.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            size={14}
                            className={
                              i < rev.rating
                                ? "fill-[#FFB800] text-[#FFB800]"
                                : "fill-gray-200 text-gray-200"
                            }
                          />
                        ))}
                      </div>

                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                          rev.is_published
                            ? "bg-[#3B6E4C]/15 text-[#3B6E4C]"
                            : "bg-[#FFB800]/20 text-[#B38300]"
                        }`}
                      >
                        {rev.is_published ? "Published" : "Draft"}
                      </span>
                    </div>

                    <p className="text-xs sm:text-sm text-[#2C221E] font-medium italic">
                      "{rev.review_text}"
                    </p>

                    <div className="text-xs text-[#685B55] font-semibold">
                      <span className="text-[#2C221E] font-bold uppercase">{rev.customer_name}</span>
                      {rev.customer_location && <span> · {rev.customer_location}</span>}
                      <span> · Order #{rev.display_order}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 self-end md:self-center">
                    <button
                      type="button"
                      onClick={() => handleTogglePublishReview(rev)}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider border transition ${
                        rev.is_published
                          ? "border-[#685B55]/30 text-[#685B55] hover:bg-gray-100"
                          : "border-[#3B6E4C] bg-[#3B6E4C]/10 text-[#3B6E4C] hover:bg-[#3B6E4C]/20"
                      }`}
                    >
                      {rev.is_published ? "Unpublish" : "Publish Live"}
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDeleteReview(rev.id)}
                      className="p-2 rounded-xl border border-[#D93333]/30 text-[#D93333] hover:bg-[#D93333]/10 transition"
                      title="Delete Review"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* ── TAB 4: SITE SETTINGS (CONTACT & SOCIAL) ── */}
      {activeTab === "settings" && (
        <div className="space-y-6">

          {/* Cloudinary Storage Status */}
          <div className="rounded-3xl bg-white border border-[#E5DCDB] p-6 md:p-8 shadow-sm space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#3B6E4C]/10 flex items-center justify-center">
                <Upload size={18} className="text-[#3B6E4C]" />
              </div>
              <div>
                <h2 className="text-sm font-black uppercase text-[#2C221E] tracking-tight">IMAGE STORAGE — CLOUDINARY</h2>
                <p className="text-xs text-[#685B55]">Configure Cloudinary in your backend .env file for cloud image storage.</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#FAF6EE] border border-[#E5DCDB] space-y-3">
              <p className="text-xs font-bold uppercase tracking-wider text-[#2C221E]">To enable Cloudinary, add these to your backend <code className="font-mono bg-[#E5DCDB] px-1.5 py-0.5 rounded text-[#2C221E]">.env</code> file:</p>
              <div className="font-mono text-xs bg-[#2C221E] text-[#FAF6EE] rounded-xl p-4 space-y-1">
                <p><span className="text-[#E88D36]">CLOUDINARY_CLOUD_NAME</span>=your_cloud_name</p>
                <p><span className="text-[#E88D36]">CLOUDINARY_API_KEY</span>=your_api_key</p>
                <p><span className="text-[#E88D36]">CLOUDINARY_API_SECRET</span>=your_api_secret</p>
              </div>
              <p className="text-[11px] text-[#685B55]">
                If Cloudinary is not configured, images are saved locally to <code className="font-mono bg-[#E5DCDB] px-1 rounded">/static/uploads/</code>. All existing image URLs continue to work after enabling Cloudinary.
              </p>
              <a
                href="https://cloudinary.com/console"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#3B6E4C] hover:underline"
              >
                <ExternalLink size={12} />
                Get Cloudinary credentials at cloudinary.com/console
              </a>
            </div>
          </div>

          {/* Contact & Social */}
          <div className="rounded-3xl bg-white border border-[#E5DCDB] p-6 md:p-8 shadow-sm space-y-6">
          <div>
            <h2 className="text-lg font-black uppercase text-[#2C221E] tracking-tight">
              SITE SETTINGS & CONTACT CHANNELS
            </h2>
            <p className="text-xs text-[#685B55] mt-1">
              Changes directly update customer website footer and customer service links upon publishing.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#2C221E] mb-2">
                <Mail size={14} className="text-[#E88D36]" />
                <span>Contact Email</span>
              </label>
              <input
                type="email"
                value={settingsDraft.contact_email || ""}
                onChange={(e) =>
                  setSettingsDraft((prev) => ({ ...prev, contact_email: e.target.value }))
                }
                placeholder="hello@jacral.com"
                className="w-full px-4 py-2.5 rounded-xl border border-[#E5DCDB] text-xs font-medium text-[#2C221E] focus:outline-none focus:border-[#E88D36]"
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#2C221E] mb-2">
                <Phone size={14} className="text-[#E88D36]" />
                <span>Contact Phone</span>
              </label>
              <input
                type="text"
                value={settingsDraft.contact_phone || ""}
                onChange={(e) =>
                  setSettingsDraft((prev) => ({ ...prev, contact_phone: e.target.value }))
                }
                placeholder="+91 98765 43210"
                className="w-full px-4 py-2.5 rounded-xl border border-[#E5DCDB] text-xs font-medium text-[#2C221E] focus:outline-none focus:border-[#E88D36]"
              />
            </div>

            <div className="md:col-span-2">
              <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#2C221E] mb-2">
                <MapPin size={14} className="text-[#E88D36]" />
                <span>Physical / Registered Address</span>
              </label>
              <input
                type="text"
                value={settingsDraft.contact_address || ""}
                onChange={(e) =>
                  setSettingsDraft((prev) => ({ ...prev, contact_address: e.target.value }))
                }
                placeholder="Bengaluru, Karnataka, India"
                className="w-full px-4 py-2.5 rounded-xl border border-[#E5DCDB] text-xs font-medium text-[#2C221E] focus:outline-none focus:border-[#E88D36]"
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#2C221E] mb-2">
                <Share2 size={14} className="text-[#E88D36]" />
                <span>Instagram Profile URL</span>
              </label>
              <input
                type="text"
                value={settingsDraft.social_instagram || ""}
                onChange={(e) =>
                  setSettingsDraft((prev) => ({ ...prev, social_instagram: e.target.value }))
                }
                placeholder="https://instagram.com/jacralfoods"
                className="w-full px-4 py-2.5 rounded-xl border border-[#E5DCDB] text-xs font-medium text-[#2C221E] focus:outline-none focus:border-[#E88D36]"
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#2C221E] mb-2">
                <Share2 size={14} className="text-[#E88D36]" />
                <span>Facebook Page URL</span>
              </label>
              <input
                type="text"
                value={settingsDraft.social_facebook || ""}
                onChange={(e) =>
                  setSettingsDraft((prev) => ({ ...prev, social_facebook: e.target.value }))
                }
                placeholder="https://facebook.com/jacralfoods"
                className="w-full px-4 py-2.5 rounded-xl border border-[#E5DCDB] text-xs font-medium text-[#2C221E] focus:outline-none focus:border-[#E88D36]"
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#2C221E] mb-2">
                <Share2 size={14} className="text-[#E88D36]" />
                <span>Twitter / X Profile URL</span>
              </label>
              <input
                type="text"
                value={settingsDraft.social_twitter || ""}
                onChange={(e) =>
                  setSettingsDraft((prev) => ({ ...prev, social_twitter: e.target.value }))
                }
                placeholder="https://twitter.com/jacralfoods"
                className="w-full px-4 py-2.5 rounded-xl border border-[#E5DCDB] text-xs font-medium text-[#2C221E] focus:outline-none focus:border-[#E88D36]"
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#2C221E] mb-2">
                <Share2 size={14} className="text-[#E88D36]" />
                <span>LinkedIn Company Page</span>
              </label>
              <input
                type="text"
                value={settingsDraft.social_linkedin || ""}
                onChange={(e) =>
                  setSettingsDraft((prev) => ({ ...prev, social_linkedin: e.target.value }))
                }
                placeholder="https://linkedin.com/company/jacral"
                className="w-full px-4 py-2.5 rounded-xl border border-[#E5DCDB] text-xs font-medium text-[#2C221E] focus:outline-none focus:border-[#E88D36]"
              />
            </div>
          </div>
          </div>
        </div>
      )}

      {/* ── CREATE REVIEW MODAL ── */}
      {newReviewModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 md:p-8 space-y-5 shadow-2xl border border-[#E5DCDB]">
            <div className="flex items-center justify-between pb-3 border-b border-[#E5DCDB]">
              <h3 className="text-base font-black uppercase text-[#2C221E]">Add Customer Review</h3>
              <button
                type="button"
                onClick={() => setNewReviewModal(false)}
                className="text-gray-400 hover:text-gray-600 font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateReview} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-[#2C221E] mb-1">
                  Customer Name *
                </label>
                <input
                  type="text"
                  required
                  value={newReviewForm.customer_name}
                  onChange={(e) =>
                    setNewReviewForm((prev) => ({ ...prev, customer_name: e.target.value }))
                  }
                  placeholder="e.g. Dr. Priya Sharma"
                  className="w-full px-3.5 py-2 rounded-xl border border-[#E5DCDB] text-xs font-bold text-[#2C221E]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-[#2C221E] mb-1">
                  Customer Location (Optional)
                </label>
                <input
                  type="text"
                  value={newReviewForm.customer_location || ""}
                  onChange={(e) =>
                    setNewReviewForm((prev) => ({ ...prev, customer_location: e.target.value }))
                  }
                  placeholder="e.g. Bengaluru, Mumbai, Kochi"
                  className="w-full px-3.5 py-2 rounded-xl border border-[#E5DCDB] text-xs font-medium text-[#2C221E]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-[#2C221E] mb-1">
                  Rating (1–5 Stars)
                </label>
                <select
                  value={newReviewForm.rating}
                  onChange={(e) =>
                    setNewReviewForm((prev) => ({ ...prev, rating: parseInt(e.target.value) || 5 }))
                  }
                  className="w-full px-3.5 py-2 rounded-xl border border-[#E5DCDB] text-xs font-bold text-[#2C221E]"
                >
                  <option value={5}>★★★★★ (5 Stars)</option>
                  <option value={4}>★★★★☆ (4 Stars)</option>
                  <option value={3}>★★★☆☆ (3 Stars)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-[#2C221E] mb-1">
                  Review Text *
                </label>
                <textarea
                  rows={3}
                  required
                  value={newReviewForm.review_text}
                  onChange={(e) =>
                    setNewReviewForm((prev) => ({ ...prev, review_text: e.target.value }))
                  }
                  placeholder="Customer feedback on taste, nutrition, energy..."
                  className="w-full px-3.5 py-2 rounded-xl border border-[#E5DCDB] text-xs font-medium text-[#2C221E]"
                />
              </div>

              <div className="flex items-center gap-4 pt-2">
                <label className="flex items-center gap-2 text-xs font-bold text-[#2C221E] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newReviewForm.is_published}
                    onChange={(e) =>
                      setNewReviewForm((prev) => ({ ...prev, is_published: e.target.checked }))
                    }
                    className="rounded text-[#3B6E4C]"
                  />
                  <span>Publish Immediately</span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#E5DCDB]">
                <button
                  type="button"
                  onClick={() => setNewReviewModal(false)}
                  className="px-4 py-2 rounded-xl border border-gray-200 text-xs font-bold text-gray-600 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2 rounded-xl bg-[#3B6E4C] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#2E583C]"
                >
                  {saving ? "Saving..." : "Create Review"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── FOOTER PUBLISH BAR ── */}
      <div className="fixed bottom-0 left-64 right-0 bg-white/95 backdrop-blur-md border-t border-[#E5DCDB] px-8 py-4 flex items-center justify-between shadow-2xl z-40">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#E88D36] animate-pulse" />
          <span className="text-xs font-bold uppercase tracking-wider text-[#2C221E]">
            CMS Control Center
          </span>
          <span className="text-xs text-[#685B55] hidden sm:inline">
            · Edits are saved as draft until you click "PUBLISH LIVE"
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleSaveDraft}
            disabled={saving || publishing}
            className="px-5 py-2 rounded-xl border border-[#2C221E]/20 bg-white text-xs font-bold uppercase tracking-wider text-[#2C221E] hover:bg-[#FAF6EE]"
          >
            {saving ? "Saving Draft..." : "Save Draft"}
          </button>
          <button
            type="button"
            onClick={handlePublishLive}
            disabled={publishing || saving}
            className="px-6 py-2 rounded-xl bg-[#E88D36] text-white text-xs font-black uppercase tracking-wider shadow-lg shadow-[#E88D36]/30 hover:bg-[#D47E2A]"
          >
            {publishing ? "Publishing..." : "PUBLISH LIVE"}
          </button>
        </div>
      </div>

    </div>
  );
}
