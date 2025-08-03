
import { getProjectsWithCookies } from "../../app/api/routes.js";

export default async function WritingProgressStats() {

    const projects = await getProjectsWithCookies();
    
     const dummyProgress = {
        totalBooks: 3,
        totalDrafts: 8,
        totalWords: 124580,
        chaptersCompleted: 24,
    };

    return (
        <div className="card-content">
            <div className="stats-grid">
                <div className="stat-item">
                    <div className="stat-value">{dummyProgress.totalBooks}</div>
                    <div className="stat-label">Books</div>
                </div>
                <div className="stat-item">
                    <div className="stat-value">
                        {dummyProgress.totalDrafts}
                    </div>
                    <div className="stat-label">Drafts</div>
                </div>
                <div className="stat-item">
                    <div className="stat-value">
                        {dummyProgress.totalWords.toLocaleString()}
                    </div>
                    <div className="stat-label">Total Words</div>
                </div>
                <div className="stat-item">
                    <div className="stat-value">
                        {dummyProgress.chaptersCompleted}
                    </div>
                    <div className="stat-label">Chapters</div>
                </div>
            </div>
        </div>
    );
}
