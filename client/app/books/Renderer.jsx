import WorkspaceMain from "./WorkspaceMain";
import { getProjectsWithCookies } from "../api/routes.js";
import PageTransition from "../components/PageTransition";

export default function Renderer() {
  // Fetch books/projects on the server
  const booksPromise = getProjectsWithCookies();

  return (
    <PageTransition>
      <div className="mx-auto max-w-[1600px] 2xl:max-w-[1760px] 3xl:max-w-[1920px] px-2 lg:px-4 xl:px-6 2xl:px-8 3xl:px-10 py-8 2xl:py-12 3xl:py-16 w-full">
        <WorkspaceMain booksPromise={booksPromise} />
      </div>
    </PageTransition>
  );
}
