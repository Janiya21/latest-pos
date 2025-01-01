import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(req:NextRequest) {
  const { searchParams } = new URL(req.url);
  try {
    const name = searchParams.get('name'); // Get search query from URL params

    const products = name
      ? await prisma.product.findMany({
        where: {
          name: {
            contains: name, // Use 'contains' for partial matching
            mode: 'insensitive', // Case-insensitive search
          },
        },
        take: 6,
      })
      : await prisma.product.findMany({
        take: 6
      });

    return NextResponse.json(products, { status: 200 });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ error: 'Error fetching products' }, { status: 500 });
  }
}