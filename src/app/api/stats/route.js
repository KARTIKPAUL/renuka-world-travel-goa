// First, create API endpoints for stats and categories

// src/app/api/stats/route.js
import dbConnect from "../../../../lib/mongodb"
import Business from '../../../../models/Service';
import Review from '../../../../models/Review';
import User from '../../../../models/User';

export async function GET() {
  await dbConnect();

  try {
    const [businessCount, reviewCount, userCount] = await Promise.all([
      Business.countDocuments(),
      Review.countDocuments(),
      User.countDocuments()
    ]);

    return Response.json({
      totalBusinesses: businessCount,
      totalReviews: reviewCount,
      totalUsers: userCount
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return Response.json({ error: 'Failed to fetch stats' }, { status: 500 });
  }
}