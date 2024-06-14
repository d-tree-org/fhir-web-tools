export default async function Page({
  params,
}: {
  params: { section: string };
}) {
  return <div>{params.section}</div>;
}
