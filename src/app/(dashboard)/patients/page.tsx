import { fetchData } from "./actions";
import Toolbar from "./toolbar";

export default async function Page({
  searchParams,
}: {
  searchParams: { q: string };
}) {
  return (
    <main className="container mt-6">
      <pre>{searchParams.q}</pre>
      {/* <Search />
       */}
      <Toolbar action={fetchData}/>
    </main>
  );
}

