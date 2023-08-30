import Link from "next/link";

const actions = [
  {
    name: "Patients",
    link: "/patients",
  },
];

export default async function Page() {
  return (
    <main className="h-full w-full">
      <main
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "70vh",
        }}
      >
        {actions.map((action) => (
          <Link key={action.link} href={action.link}>
            <div className="card w-96 bg-base-100 shadow-xl">
              <div className="card-body">
                <h2 className="card-title">{action.name}</h2>
                <div className="card-actions justify-end">{">"}</div>
              </div>
            </div>
          </Link>
        ))}
      </main>
    </main>
  );
}
