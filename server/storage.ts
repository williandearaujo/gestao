import { 
  users, 
  analysts, 
  vacationPeriods, 
  salaryHistory,
  type User, 
  type InsertUser,
  type Analyst,
  type InsertAnalyst,
  type VacationPeriod,
  type InsertVacationPeriod,
  type SalaryHistory,
  type InsertSalaryHistory
} from "@shared/schema";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Analyst methods
  getAnalysts(): Promise<Analyst[]>;
  getAnalyst(id: number): Promise<Analyst | undefined>;
  createAnalyst(analyst: InsertAnalyst): Promise<Analyst>;
  updateAnalyst(id: number, analyst: Partial<InsertAnalyst>): Promise<Analyst>;
  deleteAnalyst(id: number): Promise<boolean>;
  
  // Vacation period methods
  getVacationPeriods(analystId: number): Promise<VacationPeriod[]>;
  createVacationPeriod(period: InsertVacationPeriod): Promise<VacationPeriod>;
  deleteVacationPeriod(id: number): Promise<boolean>;
  
  // Salary history methods
  getSalaryHistory(analystId: number): Promise<SalaryHistory[]>;
  createSalaryHistoryEntry(entry: InsertSalaryHistory): Promise<SalaryHistory>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private analysts: Map<number, Analyst>;
  private vacationPeriods: Map<number, VacationPeriod>;
  private salaryHistoryEntries: Map<number, SalaryHistory>;
  private currentUserId: number;
  private currentAnalystId: number;
  private currentVacationId: number;
  private currentSalaryHistoryId: number;

  constructor() {
    this.users = new Map();
    this.analysts = new Map();
    this.vacationPeriods = new Map();
    this.salaryHistoryEntries = new Map();
    this.currentUserId = 1;
    this.currentAnalystId = 1;
    this.currentVacationId = 1;
    this.currentSalaryHistoryId = 1;
    
    // Initialize with default admin user
    this.createUser({
      username: "admin",
      password: "admin123",
      role: "admin",
      name: "Administrador",
      email: "admin@oltecnologia.com"
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { 
      ...insertUser, 
      id,
      createdAt: new Date()
    };
    this.users.set(id, user);
    return user;
  }

  async getAnalysts(): Promise<Analyst[]> {
    return Array.from(this.analysts.values()).sort((a, b) => a.name.localeCompare(b.name));
  }

  async getAnalyst(id: number): Promise<Analyst | undefined> {
    return this.analysts.get(id);
  }

  async createAnalyst(insertAnalyst: InsertAnalyst): Promise<Analyst> {
    const id = this.currentAnalystId++;
    const now = new Date();
    const analyst: Analyst = { 
      ...insertAnalyst, 
      id,
      createdAt: now,
      updatedAt: now
    };
    this.analysts.set(id, analyst);
    return analyst;
  }

  async updateAnalyst(id: number, updateData: Partial<InsertAnalyst>): Promise<Analyst> {
    const existing = this.analysts.get(id);
    if (!existing) {
      throw new Error("Analyst not found");
    }
    
    const updated: Analyst = {
      ...existing,
      ...updateData,
      updatedAt: new Date()
    };
    
    this.analysts.set(id, updated);
    return updated;
  }

  async deleteAnalyst(id: number): Promise<boolean> {
    const deleted = this.analysts.delete(id);
    
    // Also delete related vacation periods and salary history
    if (deleted) {
      Array.from(this.vacationPeriods.entries())
        .filter(([_, period]) => period.analystId === id)
        .forEach(([periodId]) => this.vacationPeriods.delete(periodId));
        
      Array.from(this.salaryHistoryEntries.entries())
        .filter(([_, entry]) => entry.analystId === id)
        .forEach(([entryId]) => this.salaryHistoryEntries.delete(entryId));
    }
    
    return deleted;
  }

  async getVacationPeriods(analystId: number): Promise<VacationPeriod[]> {
    return Array.from(this.vacationPeriods.values())
      .filter(period => period.analystId === analystId)
      .sort((a, b) => a.startDate.getTime() - b.startDate.getTime());
  }

  async createVacationPeriod(insertPeriod: InsertVacationPeriod): Promise<VacationPeriod> {
    const id = this.currentVacationId++;
    const period: VacationPeriod = { 
      ...insertPeriod, 
      id,
      createdAt: new Date()
    };
    this.vacationPeriods.set(id, period);
    return period;
  }

  async deleteVacationPeriod(id: number): Promise<boolean> {
    return this.vacationPeriods.delete(id);
  }

  async getSalaryHistory(analystId: number): Promise<SalaryHistory[]> {
    return Array.from(this.salaryHistoryEntries.values())
      .filter(entry => entry.analystId === analystId)
      .sort((a, b) => b.adjustmentDate.getTime() - a.adjustmentDate.getTime());
  }

  async createSalaryHistoryEntry(insertEntry: InsertSalaryHistory): Promise<SalaryHistory> {
    const id = this.currentSalaryHistoryId++;
    const entry: SalaryHistory = { 
      ...insertEntry, 
      id,
      createdAt: new Date()
    };
    this.salaryHistoryEntries.set(id, entry);
    return entry;
  }
}

export const storage = new MemStorage();
