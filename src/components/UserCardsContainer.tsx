import prisma from "../../prisma";
import UserCard from "./UserCard";

const UserCardsContainer = async () => {
  const [adminCount, studentCount, teacherCount, parentCount] = await Promise.all([
    prisma.admin.count({ where: { approved: "ACCEPTED" } }),
    prisma.student.count({ where: { approved: "ACCEPTED" } }),
    prisma.teacher.count({ where: { approved: "ACCEPTED" } }),
    prisma.parent.count({ where: { approved: "ACCEPTED" } }),
  ]);

  return (
    <div className="flex flex-wrap justify-between gap-4">
      <UserCard type="admin" count={adminCount} />
      <UserCard type="student" count={studentCount} />
      <UserCard type="teacher" count={teacherCount} />
      <UserCard type="parent" count={parentCount} />
    </div>
  );
};

export default UserCardsContainer;
