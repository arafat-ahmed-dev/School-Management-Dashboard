import prisma from "../../prisma";

const UserCard = async ({ type }: { type: "admin" | "teacher" | "parent" | "student" }) => {
  const roleModel: Record<typeof type, any> = {
    admin: prisma.admin,
    teacher: prisma.teacher,
    parent: prisma.parent,
    student: prisma.student,
  };
  const data = await roleModel[type].count({
    where: {
      approved: "ACCEPTED"
    }
  });
  return (
    <div className="min-w-[130px] flex-1 rounded-2xl p-4 capitalize odd:bg-aamPurple even:bg-aamYellow">
      <div className="flex items-center justify-between">
        <span className="rounded-full bg-white px-2 py-1 text-[10px] text-green-600">
          {new Date().getFullYear()}/{(new Date().getFullYear() + 1).toString().slice(-2)}
        </span>
      </div>
      <h1 className="my-4 text-2xl font-semibold">{data}</h1>
      <h2 className="text-sm font-medium capitalize text-gray-500">{type}</h2>
    </div>
  );
};

export default UserCard;
