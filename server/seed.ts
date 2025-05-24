import { supabaseAdmin } from './supabase';

async function seedDatabase() {
  try {
    // Insert sample badges
    const { error: badgesError } = await supabaseAdmin
      .from('profile_badges')
      .upsert([
        {
          badge_type: 'EARLY_SUPPORTER',
          metadata: {
            label: 'Early Supporter',
            description: 'Among the first to support public goods on our platform'
          }
        },
        {
          badge_type: 'TOP_DONOR',
          metadata: {
            label: 'Top Donor',
            description: 'Made significant contributions to public goods'
          }
        },
        {
          badge_type: 'VERIFIED_BUILDER',
          metadata: {
            label: 'Verified Builder',
            description: 'Verified project creator with successful launches'
          }
        },
        {
          badge_type: 'COMMUNITY_LEADER',
          metadata: {
            label: 'Community Leader',
            description: 'Active community member with high engagement'
          }
        },
        {
          badge_type: 'PASSPORT_VERIFIED',
          metadata: {
            label: 'Passport Verified',
            description: 'Verified human with Gitcoin Passport'
          }
        }
      ]);

    if (badgesError) throw badgesError;
    console.log('✅ Sample badges seeded');

    // Add more seed data here as needed
    
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

// Run the seed function
seedDatabase()
  .then(() => {
    console.log('Database seeding completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Database seeding failed:', error);
    process.exit(1);
  });
