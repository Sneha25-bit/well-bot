import { Response } from 'express';
import { PeriodCycle, PeriodHistory } from '../models/PeriodCycle';
import { AuthRequest } from '../middleware/auth';
import { asyncHandler } from '../middleware/errorHandler';

// @desc    Get period history
// @route   GET /api/period/history
// @access  Private
export const getPeriodHistory = asyncHandler(async (req: AuthRequest, res: Response) => {
  const userId = req.user!._id;

  let periodHistory = await PeriodHistory.findOne({ userId });

  if (!periodHistory) {
    // Create new period history if doesn't exist
    periodHistory = await PeriodHistory.create({
      userId,
      entries: [],
      averageCycleLength: 28,
      averagePeriodLength: 5,
      irregularCycles: false
    });
  }

  res.status(200).json({
    success: true,
    periodHistory
  });
});

// @desc    Add period entry
// @route   POST /api/period/entries
// @access  Private
export const addPeriodEntry = asyncHandler(async (req: AuthRequest, res: Response) => {
  const userId = req.user!._id;
  const { date, flowIntensity, symptoms, mood, notes } = req.body;

  let periodHistory = await PeriodHistory.findOne({ userId });

  if (!periodHistory) {
    periodHistory = await PeriodHistory.create({
      userId,
      entries: [],
      averageCycleLength: 28,
      averagePeriodLength: 5,
      irregularCycles: false
    });
  }

  // Check if entry already exists for this date
  const existingEntryIndex = periodHistory.entries.findIndex(
    entry => entry.date.toDateString() === new Date(date).toDateString()
  );

  const newEntry = {
    date: new Date(date),
    flowIntensity,
    symptoms: symptoms || [],
    mood: mood || 'normal',
    notes
  };

  if (existingEntryIndex >= 0) {
    // Update existing entry
    periodHistory.entries[existingEntryIndex] = newEntry;
  } else {
    // Add new entry
    periodHistory.entries.push(newEntry);
  }

  // Update averages and irregular cycles flag
  await updatePeriodStatistics(periodHistory);
  await periodHistory.save();

  res.status(201).json({
    success: true,
    entry: newEntry
  });
});

// @desc    Get current period cycle
// @route   GET /api/period/current
// @access  Private
export const getCurrentPeriodCycle = asyncHandler(async (req: AuthRequest, res: Response) => {
  const userId = req.user!._id;

  const currentCycle = await PeriodCycle.findOne({
    userId,
    isActive: true
  }).sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    currentCycle
  });
});

// @desc    Start new period cycle
// @route   POST /api/period/cycles
// @access  Private
export const startPeriodCycle = asyncHandler(async (req: AuthRequest, res: Response) => {
  const userId = req.user!._id;
  const { periodStartDate, flowIntensity, symptoms, mood, notes } = req.body;

  // End any active cycles
  await PeriodCycle.updateMany(
    { userId, isActive: true },
    { isActive: false }
  );

  // Create new cycle
  const newCycle = await PeriodCycle.create({
    userId,
    cycleStartDate: new Date(),
    periodStartDate: new Date(periodStartDate),
    flowIntensity: flowIntensity || 'medium',
    symptoms: symptoms || [],
    mood: mood || 'normal',
    notes,
    isActive: true
  });

  // Update period history
  await addPeriodEntry(req, res, () => {});

  res.status(201).json({
    success: true,
    cycle: newCycle
  });
});

// @desc    End current period cycle
// @route   PUT /api/period/cycles/:id/end
// @access  Private
export const endPeriodCycle = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { periodEndDate, notes } = req.body;

  const existingCycle = await PeriodCycle.findOne({ _id: req.params.id, userId: req.user!._id });
  
  const cycle = await PeriodCycle.findOneAndUpdate(
    { _id: req.params.id, userId: req.user!._id },
    {
      periodEndDate: new Date(periodEndDate),
      cycleEndDate: new Date(),
      isActive: false,
      notes: notes || existingCycle?.notes
    },
    { new: true, runValidators: true }
  );

  if (!cycle) {
    return res.status(404).json({
      success: false,
      message: 'Period cycle not found'
    });
  }

  // Calculate cycle and period lengths
  if (cycle.cycleEndDate && cycle.cycleStartDate) {
    cycle.cycleLength = Math.ceil(
      (cycle.cycleEndDate.getTime() - cycle.cycleStartDate.getTime()) / (1000 * 60 * 60 * 24)
    );
  }

  if (cycle.periodEndDate && cycle.periodStartDate) {
    cycle.periodLength = Math.ceil(
      (cycle.periodEndDate.getTime() - cycle.periodStartDate.getTime()) / (1000 * 60 * 60 * 24)
    );
  }

  await cycle.save();

  res.status(200).json({
    success: true,
    cycle
  });
});

// @desc    Get period predictions
// @route   GET /api/period/predictions
// @access  Private
export const getPeriodPredictions = asyncHandler(async (req: AuthRequest, res: Response) => {
  const userId = req.user!._id;

  const periodHistory = await PeriodHistory.findOne({ userId });
  
  if (!periodHistory || periodHistory.entries.length < 2) {
    return res.status(200).json({
      success: true,
      predictions: {
        nextPeriodDate: null,
        nextOvulationDate: null,
        fertileWindowStart: null,
        fertileWindowEnd: null,
        message: 'Need more data for accurate predictions'
      }
    });
  }

  // Calculate predictions based on average cycle length
  const lastEntry = periodHistory.entries[periodHistory.entries.length - 1];
  const nextPeriodDate = new Date(lastEntry.date);
  nextPeriodDate.setDate(nextPeriodDate.getDate() + periodHistory.averageCycleLength);

  const nextOvulationDate = new Date(nextPeriodDate);
  nextOvulationDate.setDate(nextOvulationDate.getDate() - 14);

  const fertileWindowStart = new Date(nextOvulationDate);
  fertileWindowStart.setDate(fertileWindowStart.getDate() - 5);

  const fertileWindowEnd = new Date(nextOvulationDate);
  fertileWindowEnd.setDate(fertileWindowEnd.getDate() + 1);

  res.status(200).json({
    success: true,
    predictions: {
      nextPeriodDate,
      nextOvulationDate,
      fertileWindowStart,
      fertileWindowEnd,
      averageCycleLength: periodHistory.averageCycleLength,
      averagePeriodLength: periodHistory.averagePeriodLength
    }
  });
});

// @desc    Get period analytics
// @route   GET /api/period/analytics
// @access  Private
export const getPeriodAnalytics = asyncHandler(async (req: AuthRequest, res: Response) => {
  const userId = req.user!._id;
  const { period = '12' } = req.query; // months

  const startDate = new Date();
  startDate.setMonth(startDate.getMonth() - Number(period));

  const [periodHistory, recentCycles] = await Promise.all([
    PeriodHistory.findOne({ userId }),
    PeriodCycle.find({
      userId,
      createdAt: { $gte: startDate }
    }).sort({ createdAt: -1 })
  ]);

  if (!periodHistory) {
    return res.status(200).json({
      success: true,
      analytics: {
        totalCycles: 0,
        averageCycleLength: 28,
        averagePeriodLength: 5,
        irregularCycles: false,
        commonSymptoms: [],
        recentCycles: []
      }
    });
  }

  // Analyze common symptoms
  const allSymptoms = periodHistory.entries.flatMap(entry => entry.symptoms);
  const symptomCounts = allSymptoms.reduce((acc, symptom) => {
    acc[symptom] = (acc[symptom] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const commonSymptoms = Object.entries(symptomCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([symptom, count]) => ({ symptom, count }));

  res.status(200).json({
    success: true,
    analytics: {
      totalCycles: recentCycles.length,
      averageCycleLength: periodHistory.averageCycleLength,
      averagePeriodLength: periodHistory.averagePeriodLength,
      irregularCycles: periodHistory.irregularCycles,
      commonSymptoms,
      recentCycles: recentCycles.slice(0, 6)
    }
  });
});

// Helper function to update period statistics
const updatePeriodStatistics = async (periodHistory: any) => {
  if (periodHistory.entries.length < 2) return;

  // Calculate average cycle length
  const cycles = [];
  for (let i = 1; i < periodHistory.entries.length; i++) {
    const prevEntry = periodHistory.entries[i - 1];
    const currentEntry = periodHistory.entries[i];
    
    if (prevEntry.flowIntensity === 'light' && currentEntry.flowIntensity !== 'light') {
      const cycleLength = Math.ceil(
        (currentEntry.date.getTime() - prevEntry.date.getTime()) / (1000 * 60 * 60 * 24)
      );
      cycles.push(cycleLength);
    }
  }

  if (cycles.length > 0) {
    periodHistory.averageCycleLength = Math.round(
      cycles.reduce((sum, length) => sum + length, 0) / cycles.length
    );

    // Check for irregular cycles (variance > 7 days)
    const variance = cycles.reduce((sum, length) => 
      sum + Math.pow(length - periodHistory.averageCycleLength, 2), 0
    ) / cycles.length;
    
    periodHistory.irregularCycles = Math.sqrt(variance) > 7;
  }

  // Calculate average period length
  const periods = [];
  let periodStart = null;
  
  for (const entry of periodHistory.entries) {
    if (entry.flowIntensity !== 'light' && !periodStart) {
      periodStart = entry.date;
    } else if (entry.flowIntensity === 'light' && periodStart) {
      const periodLength = Math.ceil(
        (entry.date.getTime() - periodStart.getTime()) / (1000 * 60 * 60 * 24)
      );
      periods.push(periodLength);
      periodStart = null;
    }
  }

  if (periods.length > 0) {
    periodHistory.averagePeriodLength = Math.round(
      periods.reduce((sum, length) => sum + length, 0) / periods.length
    );
  }

  periodHistory.lastUpdated = new Date();
};
