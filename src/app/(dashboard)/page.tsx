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
  {
    name: "Stats",
    link: "/stats",
  },
  {
    name: "Scheduled Jobs",
    link: "/jobs",
  },
];

export default async function Page() {
  return (
    <main className="h-full w-full container">
      <main className="h-full w-full flex flex-row flex-wrap gap-4">
        {actions.map((action) => (
          <Link
            key={action.link}
            href={action.link}
            className="w-full md:w-1/5"
          >
            <div className="card w-full bg-base-100 shadow-xl">
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

