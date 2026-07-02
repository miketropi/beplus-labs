"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { isAuthenticated } from "@/lib/admin-auth";

async function guard() {
  if (!(await isAuthenticated())) {
    redirect("/admin/login");
  }
}

// ─── Products ──────────────────────────────────────────

export async function createProduct(formData: FormData) {
  await guard();

  const slug = formData.get("slug") as string;
  const name = formData.get("name") as string;
  const tagline = formData.get("tagline") as string;
  const description = formData.get("description") as string;
  const featuresRaw = formData.get("features") as string;
  const status = formData.get("status") as string;
  const publishStatus = formData.get("publishStatus") as string;
  const icon = formData.get("icon") as string;
  const coverImage = formData.get("coverImage") as string;
  const galleryRaw = formData.get("gallery") as string;
  const category = formData.get("category") as string;
  const github = (formData.get("github") as string) || undefined;
  const liveDemo = (formData.get("liveDemo") as string) || undefined;

  if (!slug || !name) return { error: "Slug and name are required." };

  const features = featuresRaw
    ? featuresRaw.split("\n").map((f) => f.trim()).filter(Boolean)
    : [];

  const gallery = galleryRaw
    ? galleryRaw.split("\n").map((u) => u.trim()).filter(Boolean)
    : [];

  await prisma.product.create({
    data: {
      slug,
      name,
      tagline,
      description,
      features,
      gallery,
      status: status as "dev" | "beta" | "launched",
      publishStatus: publishStatus as "public" | "pending",
      icon,
      coverImage,
      category,
      github,
      liveDemo,
    },
  });

  revalidatePath("/products");
  revalidatePath("/admin/products");
  redirect("/admin/products");
}

export async function updateProduct(slug: string, formData: FormData) {
  await guard();

  const newSlug = formData.get("slug") as string;
  const name = formData.get("name") as string;
  const tagline = formData.get("tagline") as string;
  const description = formData.get("description") as string;
  const featuresRaw = formData.get("features") as string;
  const status = formData.get("status") as string;
  const publishStatus = formData.get("publishStatus") as string;
  const icon = formData.get("icon") as string;
  const coverImage = formData.get("coverImage") as string;
  const galleryRaw = formData.get("gallery") as string;
  const category = formData.get("category") as string;
  const github = (formData.get("github") as string) || undefined;
  const liveDemo = (formData.get("liveDemo") as string) || undefined;

  if (!newSlug || !name) return { error: "Slug and name are required." };

  const features = featuresRaw
    ? featuresRaw.split("\n").map((f) => f.trim()).filter(Boolean)
    : [];

  const gallery = galleryRaw
    ? galleryRaw.split("\n").map((u) => u.trim()).filter(Boolean)
    : [];

  if (newSlug !== slug) {
    await prisma.product.update({
      where: { slug },
      data: {
        slug: newSlug,
        name,
        tagline,
        description,
        features,
        gallery,
        status: status as "dev" | "beta" | "launched",
        publishStatus: publishStatus as "public" | "pending",
        icon,
        coverImage,
        category,
        github,
        liveDemo,
      },
    });
  } else {
    await prisma.product.update({
      where: { slug },
      data: {
        name,
        tagline,
        description,
        features,
        gallery,
        status: status as "dev" | "beta" | "launched",
        publishStatus: publishStatus as "public" | "pending",
        icon,
        coverImage,
        category,
        github,
        liveDemo,
      },
    });
  }

  revalidatePath("/products");
  revalidatePath("/admin/products");
  redirect("/admin/products");
}

export async function deleteProduct(slug: string) {
  await guard();

  await prisma.product.delete({ where: { slug } });

  revalidatePath("/products");
  revalidatePath("/admin/products");
  revalidatePath("/");
  redirect("/admin/products");
}

// ─── Feedback ──────────────────────────────────────────

export async function markFeedbackRead(id: number) {
  await guard();

  await prisma.feedback.update({
    where: { id },
    data: { read: true },
  });

  revalidatePath("/admin/feedback");
}

export async function deleteFeedback(id: number) {
  await guard();

  await prisma.feedback.delete({ where: { id } });

  revalidatePath("/admin/feedback");
}


