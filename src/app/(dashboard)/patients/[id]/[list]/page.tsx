export default async function Page({
  params,
}: {
  params: Promise<{ list: string; id: string }>;
}) {
  const { list } = await params;
  return <div>{list}</div>;
}
