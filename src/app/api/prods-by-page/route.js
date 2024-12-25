import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const search = searchParams.get('search') || '';
    const pageSize = 10; // Number of items per page

    // Calculate offset for pagination
    const skip = (page - 1) * pageSize;

    // Fetch filtered and paginated products
    const products = await prisma.product.findMany({
      where: {
        name: {
          contains: search,
          mode: 'insensitive', // Case-insensitive search
        },
      },
      skip,
      take: pageSize,
      orderBy: {
        created_at: 'desc', // Optional: Order by created_at or any other field
      },
    });

    // Fetch the total count for pagination
    const totalCount = await prisma.product.count({
      where: {
        name: {
          contains: search,
          mode: 'insensitive',
        },
      },
    });

    const totalPages = Math.ceil(totalCount / pageSize);

    return NextResponse.json(
      {
        products,
        totalPages,
        totalCount,
        currentPage: page,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ error: 'Error fetching products' }, { status: 500 });
  }
}
