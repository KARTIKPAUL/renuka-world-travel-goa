// src/app/api/categories/route.js
import { NextResponse } from 'next/server'
import Category from '../../../../models/Category'
import connectDB from '../../../../lib/mongodb'

export async function GET(request) {
  try {
    await connectDB()

    const { searchParams } = new URL(request.url);
    const includeAll = searchParams.get('includeAll') === 'true';
    const format = searchParams.get('format') || 'full'; // 'full' or 'simple'

    let query = { isActive: true };

    let categories;

    if (format === 'simple') {
      // For dropdown/select usage - return name and slug only
      categories = await Category.find(query)
        .select('name slug')
        .sort({ name: 1 })
        .lean();
      
      // Add "All Categories" option if requested
      if (includeAll) {
        categories = [
          { name: 'All Categories', slug: 'all' },
          ...categories
        ];
      }

      return NextResponse.json({ categories });
    } else {
      // For full category listing with business counts
      categories = await Category.find(query)
        .sort({ businessCount: -1, name: 1 })
        .lean();

      return NextResponse.json(categories);
    }

  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}

// You can also add other methods if needed
export async function POST(request) {
  try {
    await connectDB();
    
    const body = await request.json();
    
    // Validate required fields
    if (!body.name) {
      return NextResponse.json(
        { error: 'Category name is required' },
        { status: 400 }
      );
    }

    // Create slug from name if not provided
    if (!body.slug) {
      body.slug = body.name.toLowerCase()
        .replace(/[^a-z0-9 -]/g, '') // Remove special characters
        .replace(/\s+/g, '-') // Replace spaces with hyphens
        .replace(/-+/g, '-'); // Replace multiple hyphens with single hyphen
    }

    // Check if category with same name or slug already exists
    const existingCategory = await Category.findOne({
      $or: [
        { name: { $regex: new RegExp(`^${body.name}$`, 'i') } },
        { slug: body.slug }
      ]
    });

    if (existingCategory) {
      return NextResponse.json(
        { error: 'Category with this name or slug already exists' },
        { status: 400 }
      );
    }

    const category = new Category({
      ...body,
      businessCount: 0, // Initialize business count
      isActive: true // Set as active by default
    });

    await category.save();

    return NextResponse.json(
      { 
        message: 'Category created successfully',
        category 
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Error creating category:', error);
    return NextResponse.json(
      { error: 'Failed to create category' },
      { status: 500 }
    );
  }
}