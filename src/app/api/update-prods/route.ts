import { PrismaClient } from '@prisma/client';
import { NextResponse, NextRequest } from 'next/server';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!Array.isArray(body) || body.length === 0) {
      return NextResponse.json(
        { error: 'Invalid or empty data provided' },
        { status: 400 }
      );
    }

    // Update products in the database
    const updates = body.map(async (item: { id: string; remaining_quantity: number }) => {
      return prisma.product.update({
        where: { id: item.id },
        data: { remaining_quantity: item.remaining_quantity },
      });
    });

    // Wait for all updates to complete
    const results = await Promise.all(updates);

    return NextResponse.json(
      { message: 'Products updated successfully', data: results },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error updating products:', error);
    return NextResponse.json(
      { error: 'Error updating products' },
      { status: 500 }
    );
  }
}
