import Link from "next/link";
import { FaAngleRight } from "react-icons/fa";

const actions = [
  {
    name: "Patients",
    link: "/patients",
  },
  {
    name: "Facilities",
    link: "/facilities",
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
        className="gap-4"
      >
        {actions.map((action) => (
          <Link key={action.link} href={action.link}>
            <div className="card w-96 bg-base-100 shadow-xl">
              <div className="card-body">
                <h2 className="card-title">{action.name}</h2>
                <div className="card-actions justify-end">
                  <FaAngleRight />
                </div>
              </div>
            </div>
          </Link>
        ))}
      </main>
    </main>
  );
}
