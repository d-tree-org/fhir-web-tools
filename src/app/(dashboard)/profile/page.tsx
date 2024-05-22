import { auth } from "@/lib/auth";

export default async function Page() {
  const session = await auth();

  return (
    <main>
      <pre>{JSON.stringify(session, null, 2)}</pre>
    </main>
  );
}
