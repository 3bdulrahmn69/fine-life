import { Schema, model, models } from 'mongoose';

interface AIInsightDocument {
  userId: string;
  insights: Array<{
    id: string;
    title: string;
    description: string;
    type: 'warning' | 'tip' | 'success' | 'info';
    priority: number;
    actionable: string;
    category?: string;
  }>;
  generatedAt: Date;
  validUntil: Date;
  statisticsSnapshot: any; // Store the statistics data used to generate insights
}

const AIInsightSchema = new Schema<AIInsightDocument>(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    insights: [
      {
        id: { type: String, required: true },
        title: { type: String, required: true },
        description: { type: String, required: true },
        type: {
          type: String,
          enum: ['warning', 'tip', 'success', 'info'],
          required: true,
        },
        priority: { type: Number, required: true },
        actionable: { type: String, required: true },
        category: { type: String },
      },
    ],
    generatedAt: {
      type: Date,
      default: Date.now,
    },
    validUntil: {
      type: Date,
      required: true,
    },
    statisticsSnapshot: {
      type: Schema.Types.Mixed,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for efficient querying
AIInsightSchema.index({ userId: 1, validUntil: -1 });

// Automatically delete expired insights
AIInsightSchema.index({ validUntil: 1 }, { expireAfterSeconds: 0 });

const AIInsights =
  models.AIInsights || model<AIInsightDocument>('AIInsights', AIInsightSchema);

export default AIInsights;
