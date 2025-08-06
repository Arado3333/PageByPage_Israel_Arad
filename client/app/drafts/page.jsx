import Header from "./Header";
import DraftsDataProvider from "./DraftsDataProvider";
import { getProjectsWithCookies } from "../api/routes";
import { Suspense } from "react";
import DraftsLoader from "./DraftsLoader";
import HeaderLoader from "./HeaderLoader";

export default function DraftsPage() {
    const booksPromise = getProjectsWithCookies();

    return (
        <>
            <Suspense>
                <Header booksPromise={booksPromise} />
            </Suspense>
            <DraftsDataProvider />
        </>
    );
}
