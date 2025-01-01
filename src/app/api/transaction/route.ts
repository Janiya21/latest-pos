import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(req:NextRequest) {
  try {
    const body = await req.json();

    // Validate the request body
    const { sub_total, discounted_price, discount, total_after_discount, profit } = body;

    if (
      sub_total === undefined ||
      discounted_price === undefined ||
      total_after_discount === undefined ||
      profit === undefined
    ) {
      return NextResponse.json(
        { error: 'All fields (sub_total, discounted_price, total_after_discount, profit) are required' },
        { status: 400 }
      );
    }

    // Create a new transaction
    const newTransaction = await prisma.transaction.create({
      data: {
        sub_total,
        discount,
        discounted_price,
        total_after_discount,
        profit,
      },
    });

    return NextResponse.json(
      { message: 'Transaction created successfully', data: newTransaction },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating transaction:', error);
    return NextResponse.json(
      { error: 'Error creating transaction' },
      { status: 500 }
    );
  }
}


export async function GET(req:NextRequest) {
  const { searchParams } = new URL(req.nextUrl);
  try {
    // Extract query parameters for pagination

    const page = parseInt(searchParams.get('page') || '1', 10); // Default to page 1
    const limit = parseInt(searchParams.get('limit') || '10', 10); // Default to 10 items per page

    // Calculate the skip value
    const skip = (page - 1) * limit;

    // Fetch the total count of transactions
    const totalTransactions = await prisma.transaction.count();

    // Fetch the transactions with pagination
    const transactions = await prisma.transaction.findMany({
      skip,
      take: limit,
      orderBy: {
        created_at: 'desc', // Adjust sorting if needed
      },
    });

    // Return paginated response
    return NextResponse.json({
      data: transactions,
      page,
      limit,
      totalPages: Math.ceil(totalTransactions / limit),
      totalTransactions,
    });
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return NextResponse.json(
      { error: 'Error fetching transactions' },
      { status: 500 }
    );
  }
}