import Search from "./search";

export default async function Page({
  searchParams,
}: {
  searchParams: { q: string };
}) {
  return (
    <main>
      <pre>{searchParams.q}</pre>
      <Search />
    </main>
  );
}
