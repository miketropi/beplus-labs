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
  const icon = formData.get("icon") as string;
  const coverImage = formData.get("coverImage") as string;
  const category = formData.get("category") as string;
  const github = (formData.get("github") as string) || undefined;
  const liveDemo = (formData.get("liveDemo") as string) || undefined;

  if (!slug || !name) return { error: "Slug and name are required." };

  const features = featuresRaw
    ? featuresRaw.split("\n").map((f) => f.trim()).filter(Boolean)
    : [];

  await prisma.product.create({
    data: {
      slug,
      name,
      tagline,
      description,
      features,
      status: status as "dev" | "beta" | "launched",
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
  const icon = formData.get("icon") as string;
  const coverImage = formData.get("coverImage") as string;
  const category = formData.get("category") as string;
  const github = (formData.get("github") as string) || undefined;
  const liveDemo = (formData.get("liveDemo") as string) || undefined;

  if (!newSlug || !name) return { error: "Slug and name are required." };

  const features = featuresRaw
    ? featuresRaw.split("\n").map((f) => f.trim()).filter(Boolean)
    : [];

  if (newSlug !== slug) {
    await prisma.$transaction([
      prisma.changelogEntry.updateMany({
        where: { productSlug: slug },
        data: { productSlug: newSlug },
      }),
      prisma.product.update({
        where: { slug },
        data: {
          slug: newSlug,
          name,
          tagline,
          description,
          features,
          status: status as "dev" | "beta" | "launched",
          icon,
          coverImage,
          category,
          github,
          liveDemo,
        },
      }),
    ]);
  } else {
    await prisma.product.update({
      where: { slug },
      data: {
        name,
        tagline,
        description,
        features,
        status: status as "dev" | "beta" | "launched",
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

  await prisma.changelogEntry.deleteMany({ where: { productSlug: slug } });
  await prisma.product.delete({ where: { slug } });

  revalidatePath("/products");
  revalidatePath("/admin/products");
  revalidatePath("/");
  redirect("/admin/products");
}

// ─── Changelog ─────────────────────────────────────────

export async function createChangelogEntry(formData: FormData) {
  await guard();

  const date = formData.get("date") as string;
  const productSlug = formData.get("productSlug") as string;
  const title = formData.get("title") as string;
  const content = formData.get("content") as string;
  const version = formData.get("version") as string;
  const type = formData.get("type") as string;

  if (!date || !productSlug || !title) {
    return { error: "Date, product, and title are required." };
  }

  await prisma.changelogEntry.create({
    data: {
      date: new Date(date),
      productSlug,
      title,
      content: content || "",
      version: version || "",
      type: type as "feature" | "fix" | "improvement",
    },
  });

  revalidatePath("/changelog");
  revalidatePath("/admin/changelog");
  redirect("/admin/changelog");
}

export async function updateChangelogEntry(
  id: number,
  formData: FormData,
) {
  await guard();

  const date = formData.get("date") as string;
  const productSlug = formData.get("productSlug") as string;
  const title = formData.get("title") as string;
  const content = formData.get("content") as string;
  const version = formData.get("version") as string;
  const type = formData.get("type") as string;

  if (!date || !productSlug || !title) {
    return { error: "Date, product, and title are required." };
  }

  await prisma.changelogEntry.update({
    where: { id },
    data: {
      date: new Date(date),
      productSlug,
      title,
      content: content || "",
      version: version || "",
      type: type as "feature" | "fix" | "improvement",
    },
  });

  revalidatePath("/changelog");
  revalidatePath("/admin/changelog");
  redirect("/admin/changelog");
}

export async function deleteChangelogEntry(id: number) {
  await guard();

  await prisma.changelogEntry.delete({ where: { id } });

  revalidatePath("/changelog");
  revalidatePath("/admin/changelog");
  redirect("/admin/changelog");
}
