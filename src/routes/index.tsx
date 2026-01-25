import { createFileRoute } from "@tanstack/react-router";
import { ComponentExample } from "@/components/component-example";
// import { getReviews } from "@/lib/notion";

export const Route = createFileRoute("/")({
  component: App,
  loader: async () => {
    try {
      // const reviews = await getReviews();
      console.log("Waiting...")
      await new Promise(function (res) { setTimeout(() => res([]), 4000) })
      console.log("Done waiting")
      return { reviews: [] };
    } catch (error) {
      console.error("!!!!!!! Failed to fetch reviews:", error);
      return { reviews: [] };
    }
  },
  preload: true
});

function App() {
  const { reviews } = Route.useLoaderData();
  return <ComponentExample reviews={reviews} />;
}