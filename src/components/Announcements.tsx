import prisma from "../../prisma";

const Announcements = async () => {
  const userId = "67d2874ff735e667efa10164";
  const role = "admin";
  const roleConditions = {
    teacher: { lessons: { some: { teacherId: userId! } } },
    student: { students: { some: { id: userId! } } },
    parent: { students: { some: { parentId: userId! } } },
  };

  const data = await prisma.announcement.findMany({
    take: 3,
    orderBy: { date: "desc" },
    where: {
      ...(role !== "admin" && {
        OR: [
          { classId: null },
          { class: roleConditions[role as keyof typeof roleConditions] || {} },
        ],
      }),
    },
  });

  return (
    <div className="rounded-md bg-white p-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Announcements</h1>
        <span className="text-xs text-gray-400">View All</span>
      </div>
      <div className="mt-4 flex flex-col gap-4">
        {data[0] && (
          <div className="rounded-md bg-aamSkyLight p-4">
            <div className="flex items-center justify-between">
              <h2 className="font-medium">{data[0].title}</h2>
              <span className="rounded-md bg-white p-1 text-xs text-gray-400">
                {new Intl.DateTimeFormat("en-GB").format(data[0].date)}
              </span>
            </div>
            <p className="mt-1 text-sm text-gray-400">{data[0].description}</p>
          </div>
        )}
        {data[1] && (
          <div className="rounded-md bg-aamPurpleLight p-4">
            <div className="flex items-center justify-between">
              <h2 className="font-medium">{data[1].title}</h2>
              <span className="rounded-md bg-white p-1 text-xs text-gray-400">
                {new Intl.DateTimeFormat("en-GB").format(data[1].date)}
              </span>
            </div>
            <p className="mt-1 text-sm text-gray-400">{data[1].description}</p>
          </div>
        )}
        {data[2] && (
          <div className="rounded-md bg-aamYellowLight p-4">
            <div className="flex items-center justify-between">
              <h2 className="font-medium">{data[2].title}</h2>
              <span className="rounded-md bg-white p-1 text-xs text-gray-400">
                {new Intl.DateTimeFormat("en-GB").format(data[2].date)}
              </span>
            </div>
            <p className="mt-1 text-sm text-gray-400">{data[2].description}</p>
          </div>
        )}
      </div>
    </div>
  );
};
export default Announcements;
