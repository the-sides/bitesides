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
  // Enable static prerendering - data is fetched at build time
  preload: true,
});

function App() {
  const { reviews } = Route.useLoaderData();
  return <ComponentExample reviews={reviews} />;
}