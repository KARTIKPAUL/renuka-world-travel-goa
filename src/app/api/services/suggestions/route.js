import { NextResponse } from "next/server";
import connectDB from "../../../../../lib/mongodb";
import Business from "../../../../../models/Service";
import Category from "../../../../../models/Category";

export async function GET(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';
    const limit = parseInt(searchParams.get('limit')) || 8;

    if (!query || query.length < 2) {
      return NextResponse.json({ suggestions: [] });
    }

    // Search in businesses
    const businessSuggestions = await Business.find({
      status: { $in: ['approved', 'active'] },
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } },
        { tags: { $in: [new RegExp(query, 'i')] } },
        { subcategory: { $regex: query, $options: 'i' } }
      ]
    })
    .select('name category subcategory tags')
    .populate('category', 'name')
    .limit(limit)
    .lean();

    // Format suggestions
    const suggestions = businessSuggestions.map(business => ({
      id: business._id,
      name: business.name,
      type: 'business',
      category: business.category?.name || 'Uncategorized',
      subcategory: business.subcategory
    }));

    // Add category suggestions if query matches
    const categorySuggestions = await Category.find({
      isActive: true,
      name: { $regex: query, $options: 'i' }
    })
    .select('name')
    .limit(3)
    .lean();

    const categoryResults = categorySuggestions.map(cat => ({
      id: cat._id,
      name: cat.name,
      type: 'category',
      category: 'Category'
    }));

    const allSuggestions = [...suggestions, ...categoryResults].slice(0, limit);

    return NextResponse.json({ suggestions: allSuggestions });
  } catch (error) {
    console.error('Error fetching suggestions:', error);
    return NextResponse.json({ suggestions: [] });
  }
}