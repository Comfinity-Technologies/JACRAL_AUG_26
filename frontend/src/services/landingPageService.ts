import { apiClient } from "../api/client";
import type {
  LandingPageData,
  AdminLandingPageData,
  HeroSlideAdmin,
} from "../types/landingPage";

/**
 * Public: Fetch currently published landing page content.
 */
export async function getLandingPage(): Promise<LandingPageData> {
  const response = await apiClient.get<LandingPageData>("/api/v1/content/landing-page");
  return response.data;
}

/**
 * Admin: Fetch full landing page data with draft and published versions.
 */
export async function getAdminLandingPage(): Promise<AdminLandingPageData> {
  const response = await apiClient.get<AdminLandingPageData>("/api/v1/admin/content/landing-page");
  return response.data;
}

/**
 * Admin: Update brand text fields in draft.
 */
export async function updateBrandDraft(data: { brand_name?: string; tagline?: string }) {
  const response = await apiClient.post("/api/v1/admin/content/brand", data);
  return response.data;
}

/**
 * Admin: Upload brand logo (multipart upload).
 */
export async function uploadBrandLogo(file: File) {
  const formData = new FormData();
  formData.append("file", file);
  const response = await apiClient.post("/api/v1/admin/content/brand/logo", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
}

/**
 * Admin: Remove brand logo.
 */
export async function removeBrandLogo() {
  const response = await apiClient.delete("/api/v1/admin/content/brand/logo");
  return response.data;
}

/**
 * Admin: Upload brand favicon.
 */
export async function uploadBrandFavicon(file: File) {
  const formData = new FormData();
  formData.append("file", file);
  const response = await apiClient.post("/api/v1/admin/content/brand/favicon", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
}

/**
 * Admin: Create a new slide draft.
 */
export async function createSlide(data: Partial<HeroSlideAdmin>) {
  const response = await apiClient.post<HeroSlideAdmin>("/api/v1/admin/content/landing-page/slides", data);
  return response.data;
}

/**
 * Admin: Update an existing slide draft.
 */
export async function updateSlide(slideId: number, data: Partial<HeroSlideAdmin>) {
  const response = await apiClient.put<HeroSlideAdmin>(
    `/api/v1/admin/content/landing-page/slides/${slideId}`,
    data
  );
  return response.data;
}

/**
 * Admin: Delete a slide.
 */
export async function deleteSlide(slideId: number) {
  const response = await apiClient.delete(`/api/v1/admin/content/landing-page/slides/${slideId}`);
  return response.data;
}

/**
 * Admin: Upload an image for a hero slide (multipart).
 */
export async function uploadSlideImage(
  slideId: number,
  file: File,
  target: "desktop" | "mobile" = "desktop"
) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("target", target);
  const response = await apiClient.post(
    `/api/v1/admin/content/landing-page/slides/${slideId}/image`,
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
    }
  );
  return response.data;
}

/**
 * Admin: Update section content draft.
 */
export async function updateSectionDraft(sectionKey: string, data: any) {
  const response = await apiClient.post(
    `/api/v1/admin/content/landing-page/sections/${sectionKey}`,
    data
  );
  return response.data;
}

/**
 * Admin: Publish all drafts to live customer website.
 */
export async function publishLandingPage() {
  const response = await apiClient.post("/api/v1/admin/content/landing-page/publish");
  return response.data;
}

/**
 * Public: Get published site settings (contact info, social links).
 */
export async function getSiteSettings() {
  const response = await apiClient.get("/api/v1/content/site-settings");
  return response.data;
}

/**
 * Admin: Update site settings (contact info, social links).
 */
export async function updateSiteSettings(data: Record<string, string | null | undefined>) {
  const response = await apiClient.post("/api/v1/admin/content/site-settings", data);
  return response.data;
}

/**
 * Admin: Upload image for a How-To-Use step (1-indexed step number).
 */
export async function uploadStepImage(stepNumber: number, file: File) {
  const formData = new FormData();
  formData.append("file", file);
  const response = await apiClient.post(
    `/api/v1/admin/content/landing-page/sections/how_to_use/steps/${stepNumber}/image`,
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
    }
  );
  return response.data;
}

