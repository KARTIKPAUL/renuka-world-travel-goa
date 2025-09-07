import dbConnect from '../../../../../../lib/mongodb';
import Review from '../../../../../../models/Review';
import Business from '../../../../../../models/Business';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../../../api/auth/[...nextauth]/route';

export async function GET(request, { params }) {
  await dbConnect();
  
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page')) || 1;
  const limit = parseInt(searchParams.get('limit')) || 10;
  const skip = (page - 1) * limit;

  try {
    const reviews = await Review.find({ businessId: params.id })
      .populate('userId', 'name email avatar')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Review.countDocuments({ businessId: params.id });

    return Response.json({
      reviews,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total,
      },
    });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return Response.json({ error: 'Failed to fetch reviews' }, { status: 500 });
  }
}

export async function POST(request, { params }) {
  await dbConnect();
  
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return Response.json({ error: 'Authentication required' }, { status: 401 });
    }

    const { rating, comment, images } = await request.json();

    if (!rating || !comment) {
      return Response.json({ error: 'Rating and comment are required' }, { status: 400 });
    }

    if (rating < 1 || rating > 5) {
      return Response.json({ error: 'Rating must be between 1 and 5' }, { status: 400 });
    }

    const business = await Business.findById(params.id);
    if (!business) {
      return Response.json({ error: 'Business not found' }, { status: 404 });
    }

    const existingReview = await Review.findOne({
      businessId: params.id,
      userId: session.user.id,
    });

    if (existingReview) {
      return Response.json({ error: 'You have already reviewed this business' }, { status: 400 });
    }

    const review = await Review.create({
      businessId: params.id,
      userId: session.user.id,
      rating: parseInt(rating),
      comment: comment.trim(),
      images: images || [],
    });

    // Update business rating
    const allReviews = await Review.find({ businessId: params.id });
    const avgRating = allReviews.reduce((sum, rev) => sum + rev.rating, 0) / allReviews.length;
    
    await Business.findByIdAndUpdate(params.id, {
      rating: parseFloat(avgRating.toFixed(1)),
      reviewCount: allReviews.length,
    });

    const populatedReview = await Review.findById(review._id)
      .populate('userId', 'name email avatar');

    return Response.json({
      message: 'Review submitted successfully',
      review: populatedReview,
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating review:', error);
    return Response.json({ error: 'Failed to submit review' }, { status: 500 });
  }
}