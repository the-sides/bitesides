import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { ComponentExample } from "@/components/component-example";
import { getReviews } from "@/lib/notion";

const fetchReviews = createServerFn({ method: "GET" }).handler(async () => {
  return getReviews();
});

export const Route = createFileRoute("/")({
  component: App,
  loader: async () => {
    const reviews = await fetchReviews();
    return { reviews };
  },
});

function App() {
  const { reviews } = Route.useLoaderData();
  return <ComponentExample reviews={reviews} />;
}