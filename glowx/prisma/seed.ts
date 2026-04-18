import { PrismaClient, Role } from '@prisma/client'

const prisma = new PrismaClient()

const creators = [
  {
    email: 'aurora@glowx.live',
    name: 'Aurora Skye',
    handle: 'aurorasky',
    displayName: 'Aurora Skye',
    bio: 'Fitness & lifestyle creator from LA. Daily workouts, wellness tips and behind-the-scenes.',
    avatarUrl: 'https://api.dicebear.com/8.x/personas/svg?seed=aurora',
    bannerUrl: '',
    category: 'fitness',
    isVerified: true,
    paypalEmail: 'aurora@glowx.live',
    tiers: [
      { name: 'Basic Fan', price: 9.99, perks: ['Full post feed', 'DM access', 'Exclusive photos'] },
      { name: 'Premium', price: 19.99, perks: ['Everything in Basic', 'PPV included', 'Priority DMs', 'Live access'] },
    ],
  },
  {
    email: 'mila@glowx.live',
    name: 'Mila Voss',
    handle: 'milavoss',
    displayName: 'Mila Voss',
    bio: 'Digital artist and model. Exclusive art drops, tutorials and personal content.',
    avatarUrl: 'https://api.dicebear.com/8.x/personas/svg?seed=mila',
    bannerUrl: '',
    category: 'art',
    isVerified: true,
    paypalEmail: 'mila@glowx.live',
    tiers: [
      { name: 'Art Fan', price: 7.99, perks: ['Art drops feed', 'Behind the scenes', 'Tutorial access'] },
      { name: 'Collector', price: 14.99, perks: ['Everything in Art Fan', 'Early access drops', 'Print discounts', '1-on-1 feedback'] },
    ],
  },
  {
    email: 'jade@glowx.live',
    name: 'Jade Moreau',
    handle: 'jademo',
    displayName: 'Jade Moreau',
    bio: 'Lifestyle, travel and fashion. Living the dream from Paris to Bali.',
    avatarUrl: 'https://api.dicebear.com/8.x/personas/svg?seed=jade',
    bannerUrl: '',
    category: 'lifestyle',
    isVerified: true,
    paypalEmail: 'jade@glowx.live',
    tiers: [
      { name: 'Traveller', price: 12.99, perks: ['Travel vlogs', 'Fashion lookbooks', 'Destination guides'] },
      { name: 'VIP', price: 24.99, perks: ['Everything in Traveller', 'Brand collabs early', 'Monthly Q&A', 'PPV free'] },
    ],
  },
  {
    email: 'nyx@glowx.live',
    name: 'Nyx Black',
    handle: 'nyxblack',
    displayName: 'Nyx Black',
    bio: 'Electronic producer and performer. Unreleased tracks, studio sessions, live sets.',
    avatarUrl: 'https://api.dicebear.com/8.x/personas/svg?seed=nyx',
    bannerUrl: '',
    category: 'music',
    isVerified: false,
    paypalEmail: 'nyx@glowx.live',
    tiers: [
      { name: 'Listener', price: 6.99, perks: ['Unreleased tracks', 'Studio sessions', 'Live recordings'] },
      { name: 'Producer', price: 13.99, perks: ['Everything in Listener', 'Stems & samples', 'Collab opportunities', 'Merch discounts'] },
    ],
  },
]

async function main() {
  console.log('🌱 Seeding GlowX database...')

  for (const c of creators) {
    const user = await prisma.user.upsert({
      where: { email: c.email },
      update: {},
      create: {
        email: c.email,
        name: c.name,
        role: Role.CREATOR,
        emailVerified: new Date(),
      },
    })

    const creator = await prisma.creator.upsert({
      where: { userId: user.id },
      update: {},
      create: {
        userId: user.id,
        handle: c.handle,
        displayName: c.displayName,
        bio: c.bio,
        avatarUrl: c.avatarUrl,
        category: c.category,
        isVerified: c.isVerified,
        paypalEmail: c.paypalEmail,
      },
    })

    for (const tier of c.tiers) {
      await prisma.subscriptionTier.upsert({
        where: { id: `${creator.id}-${tier.name}`.slice(0, 25) },
        update: {},
        create: {
          id: `${creator.id}-${tier.name}`.slice(0, 25),
          creatorId: creator.id,
          name: tier.name,
          price: tier.price,
          interval: 'month',
          perks: tier.perks,
        },
      })
    }

    // Seed sample posts
    await prisma.post.createMany({
      skipDuplicates: true,
      data: [
        {
          creatorId: creator.id,
          title: `Welcome to my GlowX page!`,
          body: `Thanks for subscribing. This is your exclusive access to all my content.`,
          mediaUrls: [],
          visibility: 'PUBLIC',
          publishedAt: new Date(),
          likes: Math.floor(Math.random() * 500) + 100,
        },
        {
          creatorId: creator.id,
          title: `Exclusive content drop`,
          body: `This one is just for subscribers. Enjoy!`,
          mediaUrls: [],
          visibility: 'SUBSCRIBERS',
          publishedAt: new Date(),
          likes: Math.floor(Math.random() * 300) + 50,
        },
      ],
    })

    console.log(`  ✓ ${c.displayName} (@${c.handle})`)
  }

  console.log('✅ Seed complete!')
}

main()
  .catch(e => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
