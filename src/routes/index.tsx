import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { HomePage } from "@/components/HomePage";
import { getPosts } from "@/lib/notion";

const fetchPosts = createServerFn({ method: "GET" }).handler(async () => {
  try {
    return await getPosts();
  } catch (error) {
    console.error("Failed to fetch wedding posts:", error);
    return [];
  }
});

export const Route = createFileRoute("/")({
  component: HomeRoute,
  loader: async () => {
    const posts = await fetchPosts();
    return { posts };
  },
  preload: true,
});

function HomeRoute() {
  const { posts } = Route.useLoaderData();
  return <HomePage posts={posts} />;
}
