import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import connectDB from '../../lib/mongodb';
import UserPreferences from '../../models/UserPreferences';
import { CURRENCIES } from '../../lib/currency';

// GET /api/preferences
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    let preferences = await UserPreferences.findOne({
      userId: session.user.id,
    });

    // Create default preferences if none exist
    if (!preferences) {
      preferences = new UserPreferences({
        userId: session.user.id,
        currency: 'USD',
      });
      await preferences.save();
    }

    return NextResponse.json({
      currency: preferences.currency,
    });
  } catch (error) {
    console.error('Error fetching user preferences:', error);
    return NextResponse.json(
      { error: 'Failed to fetch preferences' },
      { status: 500 }
    );
  }
}

// PUT /api/preferences
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();
    await connectDB();

    // Only allow updating currency field
    if (!data.currency) {
      return NextResponse.json(
        { error: 'Only currency updates are allowed' },
        { status: 400 }
      );
    }

    // Validate currency
    if (!CURRENCIES[data.currency as keyof typeof CURRENCIES]) {
      return NextResponse.json(
        { error: 'Invalid currency code' },
        { status: 400 }
      );
    }

    // Update only the currency field
    const preferences = await UserPreferences.findOneAndUpdate(
      { userId: session.user.id },
      {
        currency: data.currency,
        userId: session.user.id,
      },
      {
        new: true,
        upsert: true,
        runValidators: true,
      }
    );

    return NextResponse.json({
      message: 'Currency updated successfully',
      currency: preferences.currency,
    });
  } catch (error) {
    console.error('Error updating user currency:', error);
    return NextResponse.json(
      { error: 'Failed to update currency' },
      { status: 500 }
    );
  }
}
