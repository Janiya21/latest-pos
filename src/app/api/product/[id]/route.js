import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function PUT(req, { params }) {
  try {
    const productId = params.id;
    const productData = await req.json();

    // Validate required fields
    if (
      !productData.name ||
      typeof productData.market_value !== 'number' ||
      typeof productData.purchase_quantity !== 'number' ||
      typeof productData.unit_purchase_price !== 'number' ||
      typeof productData.unit_sell_price !== 'number'
    ) {
      return NextResponse.json({ error: 'Invalid input data' }, { status: 400 });
    }

    // Check if the product exists
    const existingProduct = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!existingProduct) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    // Update the product
    const updatedProduct = await prisma.product.update({
      where: { id: productId },
      data: {
        name: productData.name,
        market_value: productData.market_value,
        purchase_quantity: productData.purchase_quantity,
        unit_purchase_price: productData.unit_purchase_price,
        unit_sell_price: productData.unit_sell_price,
        remaining_quantity: productData.remaining_quantity,
        sold_quantity: productData.sold_quantity,
      },
    });

    return NextResponse.json(updatedProduct, { status: 200 });
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
  }
}
