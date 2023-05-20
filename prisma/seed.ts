import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

async function main() {
  const user = await db.user.create({
    data: {
      name: "Jack",
    },
  });

  const room = await db.room.create({
    data: {
      name: "Room 1",
    },
  });

  console.log(user, room);
}

main()
  .then(async () => {
    await db.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await db.$disconnect();
    process.exit(1);
  });
