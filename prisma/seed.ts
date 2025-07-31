import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  const user = await prisma.users.create({
    data: {
      name: "Kaku",
      email: "kaku@cp0.com",
      password: "CP0",
    }
  })

  const category = await prisma.category.create({
    data: {
      category: "Training",
      userId: user.id,
    }
  })

  const transaction = await prisma.transactions.create({
    data: {
      name: "Beli barbel",
      nominal: 2000000,
      userId: user.id,
      categoryId: category.id,
    }
  })
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect())
