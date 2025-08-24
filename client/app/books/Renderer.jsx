import WorkspaceMain from "./WorkspaceMain";
import { getProjectsWithCookies } from "../api/routes.js";

export default function Renderer() {
    // Fetch books/projects on the server
    const booksPromise = getProjectsWithCookies();

    return (
        <div className="min-h-screen bg-background text-foreground">
            <WorkspaceMain booksPromise={booksPromise} />
        </div>
    );
}
