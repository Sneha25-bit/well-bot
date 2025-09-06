export interface DashboardStats {
  totalMedicines: number;
  activeMedicines: number;
  medicinesTakenToday: number;
  upcomingReminders: number;
  healthScore: number;
  lastPeriodDate?: string;
  nextPeriodDate?: string;
  cycleLength?: number;
  activeHealthPlans: number;
  completedTasks: number;
  totalTasks: number;
}

export interface HealthMetric {
  label: string;
  value: string;
  status: string;
  color: string;
}
