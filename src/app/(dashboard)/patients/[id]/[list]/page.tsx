export default async function Page({
  params,
}: {
  params: { list: string; id: string };
}) {
  return <div>{params.list}</div>;
}
