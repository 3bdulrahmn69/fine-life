import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import connectDB from '../../../lib/mongodb';
import Budget from '../../../models/Budget';

// GET /api/budget/[id]
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

    const budget = await Budget.findOne({
      _id: id,
      userId: session.user.id,
    });

    if (!budget) {
      return NextResponse.json({ error: 'Budget not found' }, { status: 404 });
    }

    return NextResponse.json(budget);
  } catch (error) {
    console.error('Error fetching budget:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/budget/[id]
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
    const { name, category, amount, currency, isOverall } = body;

    // Validation
    if (!name?.trim() || !amount || !currency) {
      return NextResponse.json(
        { error: 'Name, amount, and currency are required' },
        { status: 400 }
      );
    }

    if (!isOverall && !category?.trim()) {
      return NextResponse.json(
        { error: 'Category is required for category budgets' },
        { status: 400 }
      );
    }

    if (typeof amount !== 'number' || amount <= 0) {
      return NextResponse.json(
        { error: 'Amount must be a positive number' },
        { status: 400 }
      );
    }

    await connectDB();

    // Check if another active budget with the same category/overall already exists (excluding current one)
    const existingBudgetQuery: Record<string, unknown> = {
      userId: session.user.id,
      isActive: true,
      isOverall: Boolean(isOverall),
      _id: { $ne: id },
    };

    if (!isOverall && category?.trim()) {
      existingBudgetQuery.category = category.trim();
    }

    const existingBudget = await Budget.findOne(existingBudgetQuery);
    if (existingBudget) {
      const message = isOverall
        ? 'You already have an active overall budget'
        : 'You already have an active budget for this category';
      return NextResponse.json({ error: message }, { status: 409 });
    }

    const updateData = {
      name: name.trim(),
      category: isOverall ? undefined : category?.trim(),
      amount,
      currency: currency.toUpperCase(),
      isOverall: Boolean(isOverall),
    };

    const budget = await Budget.findOneAndUpdate(
      {
        _id: id,
        userId: session.user.id,
      },
      updateData,
      { new: true, runValidators: true }
    );

    if (!budget) {
      return NextResponse.json({ error: 'Budget not found' }, { status: 404 });
    }

    return NextResponse.json(budget);
  } catch (error) {
    console.error('Error updating budget:', error);

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/budget/[id]
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

    const budget = await Budget.findOneAndDelete({
      _id: id,
      userId: session.user.id,
    });

    if (!budget) {
      return NextResponse.json({ error: 'Budget not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Budget deleted successfully' });
  } catch (error) {
    console.error('Error deleting budget:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
