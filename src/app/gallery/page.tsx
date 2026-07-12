import { redirect } from "next/navigation";

/**
 * Gallery has been consolidated into Projects.
 * Redirect any visitors who land on /gallery to /projects.
 */
export default function GalleryRedirect() {
  redirect("/projects");
}
