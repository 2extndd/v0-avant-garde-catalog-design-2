
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
    console.log('Testing Prisma Connection...')
    try {
        const products = await prisma.products.findMany({
            take: 5,
            select: { id: true, name: true, telegram_channel_id: true }
        })
        console.log('Successfully fetched products:')
        console.log(JSON.stringify(products, (key, value) =>
            typeof value === 'bigint' ? value.toString() : value
            , 2))
    } catch (e) {
        console.error('Prisma Error:', e)
    } finally {
        await prisma.$disconnect()
    }
}

main()
