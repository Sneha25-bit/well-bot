export interface Medicine {
  _id: string;
  name: string;
  dosage: string;
  frequency: string;
  times: string[];
  instructions?: string;
  isActive: boolean;
  isAISuggested: boolean;
  reminders: {
    enabled: boolean;
    times: string[];
    days: number[];
  };
  createdAt: string;
  updatedAt: string;
}

export interface MedicineTaken {
  _id: string;
  medicineId: string;
  takenAt: string;
  time: string;
  notes?: string;
  createdAt: string;
}

export interface CreateMedicineRequest {
  name: string;
  dosage: string;
  frequency: string;
  times: string[];
  instructions?: string;
  reminders: {
    enabled: boolean;
    times: string[];
    days: number[];
  };
}

export interface MarkMedicineTakenRequest {
  time: string;
  notes?: string;
}
