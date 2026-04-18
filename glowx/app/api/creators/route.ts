import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const category = searchParams.get('category')
  const search   = searchParams.get('q')
  const limit    = Math.min(parseInt(searchParams.get('limit') ?? '20'), 50)

  const creators = await prisma.creator.findMany({
    where: {
      isActive: true,
      ...(category && category !== 'all' ? { category } : {}),
      ...(search ? {
        OR: [
          { displayName: { contains: search, mode: 'insensitive' } },
          { handle: { contains: search, mode: 'insensitive' } },
          { bio: { contains: search, mode: 'insensitive' } },
        ],
      } : {}),
    },
    take: limit,
    include: {
      tiers: { where: { isActive: true }, orderBy: { price: 'asc' } },
      _count: { select: { subscribers: true, posts: true } },
    },
    orderBy: { subscribers: { _count: 'desc' } },
  })

  return NextResponse.json({ creators })
}
