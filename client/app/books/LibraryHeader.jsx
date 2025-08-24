import { Button } from "./ui/button";
import { Plus } from "lucide-react";

export default function LibraryHeader({onNewProject}) {
    return (
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0 mb-6">
            <div>
                <h1 data-testid="cypress-book-workspace-title" className="text-2xl font-bold">Book Workspace</h1>
                <p className="text-muted">
                    Manage your active writing projects
                </p>
            </div>
            <div className="inline-flex gap-2">
                <Button
                    data-testid="cypress-new-project-btn"
                    className="new-project-btn btn-primary font-medium mobile-full"
                    onClick={() => onNewProject()}
                >
                    <Plus className="w-4 h-4 mr-2" />
                    New Project
                </Button>
            </div>
        </div>
    );
}
