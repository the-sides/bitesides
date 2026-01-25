import { createFileRoute } from "@tanstack/react-router";
import { HomePage } from "@/components/HomePage";
import { getReviews } from "@/lib/notion";

export const Route = createFileRoute("/")({
  component: HomeRoute,
  loader: async () => {
    try {
      const reviews = await getReviews();
      return { reviews };
    } catch (error) {
      console.error("Failed to fetch reviews:", error);
      return { reviews: [] };
    }
  },
  preload: true
});

function HomeRoute() {
  const { reviews } = Route.useLoaderData();
  return <HomePage reviews={reviews} />;
}