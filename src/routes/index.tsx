import { createFileRoute } from "@tanstack/react-router";
import { ComponentExample } from "@/components/component-example";
import { getReviews } from "@/lib/notion";

export const Route = createFileRoute("/")({
  component: App,
  loader: async () => {
    const reviews = await getReviews();
    return { reviews };
  },
});

function App() {
  const { reviews } = Route.useLoaderData();
  return <ComponentExample reviews={reviews} />;
}