import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import connectDB from '../../../lib/mongodb';
import Transaction from '../../../models/Transaction';
import { TransactionType } from '../../../types/transaction';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    await connectDB();

    const transaction = await Transaction.findOne({
      _id: id,
      userId: session.user.id,
    });

    if (!transaction) {
      return NextResponse.json(
        { error: 'Transaction not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(transaction);
  } catch (error) {
    console.error('Error fetching transaction:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    const body = await request.json();
    const {
      amount,
      currency,
      description,
      category,
      subcategory,
      notes,
      isMandatory,
      isAutomatic,
      type,
      date,
    } = body;

    // Validation
    if (!amount || !currency || !description || !category || !type || !date) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (!Object.values(TransactionType).includes(type)) {
      return NextResponse.json(
        { error: 'Invalid transaction type' },
        { status: 400 }
      );
    }

    if (typeof amount !== 'number' || amount === 0) {
      return NextResponse.json(
        { error: 'Amount must be a non-zero number' },
        { status: 400 }
      );
    }

    await connectDB();

    const updateData = {
      amount: Math.abs(amount),
      currency: currency || 'USD',
      description: description.trim(),
      category,
      subcategory: subcategory || undefined,
      notes: notes?.trim() || undefined,
      isMandatory: Boolean(isMandatory),
      isAutomatic: Boolean(isAutomatic),
      type,
      date: new Date(date),
    };

    const transaction = await Transaction.findOneAndUpdate(
      { _id: id, userId: session.user.id },
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!transaction) {
      return NextResponse.json(
        { error: 'Transaction not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(transaction);
  } catch (error) {
    console.error('Error updating transaction:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    await connectDB();

    const transaction = await Transaction.findOneAndDelete({
      _id: id,
      userId: session.user.id,
    });

    if (!transaction) {
      return NextResponse.json(
        { error: 'Transaction not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Transaction deleted successfully' });
  } catch (error) {
    console.error('Error deleting transaction:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
