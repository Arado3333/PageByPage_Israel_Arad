import Header from "./Header";
import DraftsDataProvider from "./DraftsDataProvider";
import DraftsFound from "./DraftsFound";
import DraftsFoundLoader from "./DraftsFoundLoader";
import { getProjectsWithCookies } from "../api/routes";
import { Suspense } from "react";

export default function DraftsPage() {
  const booksPromise = getProjectsWithCookies();

  return (
    <>
      <Header />
      <Suspense fallback={<DraftsFoundLoader />}>
        <DraftsFound booksPromise={booksPromise} />
      </Suspense>
      <DraftsDataProvider />
    </>
  );
}
