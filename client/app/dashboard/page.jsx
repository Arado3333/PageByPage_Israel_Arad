import Link from "next/link";
import "../style/Dashboard.css";
import WritingProgressCard from "../../components/overview/WritingProgressCard";
import DailyGoalCard from "../../components/overview/DailyGoalCard";
import WritingStreakCard from "../../components/overview/WritingStreakCard";
import UpcomingTasksCard from "../../components/overview/UpcomingTasksCard";
import RecentDraftsCard from "../../components/overview/RecentDraftsCard";
import AISuggestionsCard from "../../components/overview/AISuggestionsCard";
import QuickActionsCard from "../../components/overview/QuickActionsCard";
import WritingProgressStats from "../../components/overview/WritingProgressStats";
import { getProjects } from "../api/routes.js";

export default function DashboardPage() {

    return (
        <div className="dashboard-container">
            <h1 className="dashboard-title">Welcome back, Writer</h1>
            <p className="dashboard-subtitle">
                Here's an overview of your writing journey
            </p>

            {
                <div className="dashboard-grid">
                    <WritingProgressCard/>
                    <DailyGoalCard />
                    <WritingStreakCard />
                    <UpcomingTasksCard />
                    <RecentDraftsCard />
                    <AISuggestionsCard />
                    <QuickActionsCard />
                    <div className="dashboard-card footer-card">
                        <div className="card-header">
                            <h2 className="card-title">About Page by Page</h2>
                        </div>
                        <div className="card-content">
                            <div className="footer-columns">
                                <div className="footer-column">
                                    <h4>About</h4>
                                    <p>
                                        Page by Page is a smart and intuitive
                                        platform for writers to manage books,
                                        drafts, and creative work efficiently.
                                    </p>
                                </div>
                                <div className="footer-column">
                                    <h4>Useful Links</h4>
                                    <ul>
                                        <li>
                                            <Link href="/contact">
                                                Contact Us
                                            </Link>
                                        </li>
                                        <li>
                                            <Link href="/help">
                                                Help Center
                                            </Link>
                                        </li>
                                        <li>
                                            <Link href="/privacy">
                                                Privacy Policy
                                            </Link>
                                        </li>
                                    </ul>
                                </div>
                                <div className="footer-column">
                                    <h4>Connect</h4>
                                    <p>Email: support@pagebypage.ai</p>
                                    <p>© 2025 Page by Page</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            }
        </div>
    );
}
