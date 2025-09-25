import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import connectDB from '../../../lib/mongodb';
import AutomaticTransaction from '../../../models/AutomaticTransaction';
import { AutoTransactionStatus } from '../../../types/automatic-transaction';
import { AutomaticTransactionService } from '../../../services/automaticTransactionService';

interface Params {
  params: {
    id: string;
  };
}

// GET /api/automatic-transactions/[id]
export async function GET(request: NextRequest, { params }: Params) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    await connectDB();

    const autoTransaction = await AutomaticTransaction.findOne({
      _id: id,
      userId: session.user.id,
    });

    if (!autoTransaction) {
      return NextResponse.json(
        { error: 'Automatic transaction not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(autoTransaction);
  } catch (error) {
    console.error('Error fetching automatic transaction:', error);
    return NextResponse.json(
      { error: 'Failed to fetch automatic transaction' },
      { status: 500 }
    );
  }
}

// PUT /api/automatic-transactions/[id]
export async function PUT(request: NextRequest, { params }: Params) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const data = await request.json();
    await connectDB();

    // Convert string values to appropriate types (only for fields that exist)
    const parsedData: Record<string, unknown> = {
      ...data,
      updatedAt: new Date(),
    };

    // Only parse numeric fields if they exist and are not undefined/null
    if (
      data.amount !== undefined &&
      data.amount !== null &&
      data.amount !== ''
    ) {
      parsedData.amount = parseFloat(data.amount);
    }
    if (
      data.recurrenceInterval !== undefined &&
      data.recurrenceInterval !== null &&
      data.recurrenceInterval !== ''
    ) {
      parsedData.recurrenceInterval = parseInt(data.recurrenceInterval) || 1;
    }
    if (
      data.dayOfMonth !== undefined &&
      data.dayOfMonth !== null &&
      data.dayOfMonth !== ''
    ) {
      parsedData.dayOfMonth = parseInt(data.dayOfMonth);
    } else if (data.dayOfMonth === '' || data.dayOfMonth === null) {
      parsedData.dayOfMonth = undefined;
    }
    if (
      data.dayOfWeek !== undefined &&
      data.dayOfWeek !== null &&
      data.dayOfWeek !== ''
    ) {
      parsedData.dayOfWeek = parseInt(data.dayOfWeek);
    } else if (data.dayOfWeek === '' || data.dayOfWeek === null) {
      parsedData.dayOfWeek = undefined;
    }
    if (data.startDate && data.startDate !== '') {
      parsedData.startDate = AutomaticTransactionService.createMidnightDate(
        data.startDate
      );
    }
    if (data.endDate && data.endDate !== '') {
      parsedData.endDate = AutomaticTransactionService.createMidnightDate(
        data.endDate
      );
    } else if (data.endDate === '' || data.endDate === null) {
      parsedData.endDate = undefined;
    }

    // Check if frequency-related fields were updated to recalculate next execution date
    const frequencyFields = [
      'recurrenceType',
      'recurrenceInterval',
      'dayOfMonth',
      'dayOfWeek',
      'startDate',
    ];

    const hasFrequencyUpdate = frequencyFields.some((field) =>
      data.hasOwnProperty(field)
    );

    let updateData = parsedData;

    if (hasFrequencyUpdate) {
      // Get the existing transaction to merge with updated data
      const existingTransaction = await AutomaticTransaction.findOne({
        _id: id,
        userId: session.user.id,
      });

      if (existingTransaction) {
        // Merge existing data with updates for complete frequency calculation
        const mergedData = {
          recurrenceType:
            parsedData.recurrenceType || existingTransaction.recurrenceType,
          recurrenceInterval:
            parsedData.recurrenceInterval ||
            existingTransaction.recurrenceInterval,
          dayOfMonth:
            parsedData.dayOfMonth !== undefined
              ? parsedData.dayOfMonth
              : existingTransaction.dayOfMonth,
          dayOfWeek:
            parsedData.dayOfWeek !== undefined
              ? parsedData.dayOfWeek
              : existingTransaction.dayOfWeek,
          startDate: parsedData.startDate || existingTransaction.startDate,
        };

        // Recalculate next execution date based on complete frequency settings
        const nextExecutionDate =
          AutomaticTransactionService.calculateInitialNextExecutionDate(
            mergedData.startDate,
            mergedData.recurrenceType,
            mergedData.recurrenceInterval,
            mergedData.dayOfMonth,
            mergedData.dayOfWeek
          );

        console.log(
          `Recalculated next execution date for transaction ${id}:`,
          nextExecutionDate
        );

        updateData = {
          ...parsedData,
          nextExecutionDate,
        };
      }
    }

    const autoTransaction = await AutomaticTransaction.findOneAndUpdate(
      {
        _id: id,
        userId: session.user.id,
      },
      updateData,
      { new: true, runValidators: true }
    );

    if (!autoTransaction) {
      return NextResponse.json(
        { error: 'Automatic transaction not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: 'Automatic transaction updated successfully',
      transaction: autoTransaction,
    });
  } catch (error) {
    console.error('Error updating automatic transaction:', error);
    return NextResponse.json(
      { error: 'Failed to update automatic transaction' },
      { status: 500 }
    );
  }
}

// DELETE /api/automatic-transactions/[id]
export async function DELETE(request: NextRequest, { params }: Params) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    await connectDB();

    const autoTransaction = await AutomaticTransaction.findOneAndUpdate(
      {
        _id: id,
        userId: session.user.id,
      },
      { status: AutoTransactionStatus.CANCELLED },
      { new: true }
    );

    if (!autoTransaction) {
      return NextResponse.json(
        { error: 'Automatic transaction not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: 'Automatic transaction cancelled successfully',
      transaction: autoTransaction,
    });
  } catch (error) {
    console.error('Error cancelling automatic transaction:', error);
    return NextResponse.json(
      { error: 'Failed to cancel automatic transaction' },
      { status: 500 }
    );
  }
}
