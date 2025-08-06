import Header from "./Header";
import DraftsDataProvider from "./DraftsDataProvider";
import { getProjectsWithCookies } from "../api/routes";

export default function DraftsPage() {

    const booksPromise = getProjectsWithCookies();

    return (
        <>
            <Header booksPromise={booksPromise}/>
            <DraftsDataProvider />
        </>
    );
}
