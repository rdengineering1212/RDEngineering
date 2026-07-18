import { prisma } from "@/lib/prisma";
import ProjectsClient from "./ProjectsClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata = {
  title: "Projects Portfolio",
  description: "Explore our record of structural fabrication, insulated panels, pipeline setups, and custom machine works built across South India.",
};

export default async function ProjectsPage() {
  const projects = await prisma.project.findMany({
    orderBy: { createdAt: "desc" },
  });

  return <ProjectsClient initialProjects={projects} />;
}
