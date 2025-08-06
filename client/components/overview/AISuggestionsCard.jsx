import {
    Sparkles,
    PenTool,
    CheckCircle2,
    AlertCircle,
    ChevronRight,
} from "lucide-react";
import Link from "next/link";
import { askAI } from "../../app/api/routes";
import { Suspense } from "react";
import AiSuggestionsContent from "./AiSuggestionsContent";
import AiSkeleton from "./skeletons/AiSkeleton";
// Import suggestions from AI Consultant or shared utility/hook
// import useAISuggestions from "../../app/ai-consultant/useAISuggestions"

export default function AISuggestionsCard() {
    //Add suspense fallback
    /*
  This component should:
  1. send a request to the gemini api with the finished chapters / drafts.
  2. inside the request prompt, we'll send a custom instruction
  3. inject the output inside this component.
   */

    const aiPromise = askAI();

    return (
        <div className="dashboard-card ai-card">
            <div className="card-header">
                <h2 className="card-title">
                    <Sparkles className="card-icon" />
                    AI Suggestions
                </h2>
            </div>
            <Suspense fallback={<AiSkeleton />}>
                <AiSuggestionsContent aiPromise={aiPromise} />
            </Suspense>
            <div className="card-footer">
                <Link href="/ai-consultant" className="card-link">
                    Get more AI help <ChevronRight className="link-icon" />
                </Link>
            </div>
        </div>
    );
}
