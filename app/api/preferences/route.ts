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
        timezone: 'UTC',
      });
      await preferences.save();
    }

    return NextResponse.json({
      currency: preferences.currency,
      timezone: preferences.timezone || 'UTC',
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

    // Prepare update object
    const updateData: any = { userId: session.user.id };

    // Validate and add currency if provided
    if (data.currency) {
      if (!CURRENCIES[data.currency as keyof typeof CURRENCIES]) {
        return NextResponse.json(
          { error: 'Invalid currency code' },
          { status: 400 }
        );
      }
      updateData.currency = data.currency;
    }

    // Validate and add timezone if provided
    if (data.timezone) {
      // Basic timezone validation (you can expand this)
      try {
        Intl.DateTimeFormat(undefined, { timeZone: data.timezone });
        updateData.timezone = data.timezone;
      } catch (error) {
        return NextResponse.json(
          { error: 'Invalid timezone' },
          { status: 400 }
        );
      }
    }

    // Ensure at least one field is being updated
    if (!data.currency && !data.timezone) {
      return NextResponse.json(
        { error: 'No valid fields to update' },
        { status: 400 }
      );
    }

    // Update preferences
    const preferences = await UserPreferences.findOneAndUpdate(
      { userId: session.user.id },
      updateData,
      {
        new: true,
        upsert: true,
        runValidators: true,
      }
    );

    return NextResponse.json({
      message: 'Preferences updated successfully',
      currency: preferences.currency,
      timezone: preferences.timezone,
    });
  } catch (error) {
    console.error('Error updating user currency:', error);
    return NextResponse.json(
      { error: 'Failed to update currency' },
      { status: 500 }
    );
  }
}
