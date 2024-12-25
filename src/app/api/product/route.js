import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const productData = await req.json();
    if (
      !productData.name ||
      !productData.unit_type ||
      typeof productData.market_value !== 'number' ||
      typeof productData.purchase_quantity !== 'number' ||
      typeof productData.unit_purchase_price !== 'number' ||
      typeof productData.unit_sell_price !== 'number'
    ) {
      return NextResponse.json({ error: 'Invalid input data' }, { status: 400 });
    }
    const newProduct = await prisma.product.create({
      data: productData,
    });
    return NextResponse.json(newProduct);
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json({ error: 'Failed to create product' });
  }
}


export async function GET(req) {
  try {
    const products = await prisma.product.findMany();
    return NextResponse.json(products, { status: 200 });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ error: 'Error fetching Products' }, { status: 500 });
  }
}
