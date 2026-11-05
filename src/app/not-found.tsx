import RedirectHome from "@/components/RedirectHome";

// Any page that doesn't exist sends the visitor to the home page instead of a 404 screen.
export default function NotFound() {
  return <RedirectHome />;
}
