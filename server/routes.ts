import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertAnalystSchema, insertVacationPeriodSchema, insertSalaryHistorySchema } from "@shared/schema";

interface AuthenticatedRequest extends Request {
  user?: { id: number; role: string; username: string; name: string; email: string };
}

// Simple session middleware simulation
const sessions = new Map<string, any>();

function generateSessionId(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

async function authenticate(req: AuthenticatedRequest, res: Response, next: Function) {
  const sessionId = req.headers.authorization?.replace('Bearer ', '');
  
  if (!sessionId || !sessions.has(sessionId)) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  
  req.user = sessions.get(sessionId);
  next();
}

function requireRole(roles: string[]) {
  return (req: AuthenticatedRequest, res: Response, next: Function) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Insufficient permissions" });
    }
    next();
  };
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth routes
  app.post("/api/auth/login", async (req: Request, res: Response) => {
    try {
      const { username, password } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ message: "Username and password required" });
      }
      
      const user = await storage.getUserByUsername(username);
      
      if (!user || user.password !== password) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      const sessionId = generateSessionId();
      sessions.set(sessionId, {
        id: user.id,
        role: user.role,
        username: user.username,
        name: user.name,
        email: user.email
      });
      
      res.json({
        sessionId,
        user: {
          id: user.id,
          role: user.role,
          username: user.username,
          name: user.name,
          email: user.email
        }
      });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  app.post("/api/auth/logout", authenticate, async (req: AuthenticatedRequest, res: Response) => {
    const sessionId = req.headers.authorization?.replace('Bearer ', '');
    if (sessionId) {
      sessions.delete(sessionId);
    }
    res.json({ message: "Logged out successfully" });
  });
  
  app.get("/api/auth/me", authenticate, async (req: AuthenticatedRequest, res: Response) => {
    res.json({ user: req.user });
  });

  // Analyst routes
  app.get("/api/analysts", authenticate, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const analysts = await storage.getAnalysts();
      
      // Filter sensitive information based on user role
      const filteredAnalysts = analysts.map(analyst => {
        if (req.user!.role === 'analyst') {
          const { currentSalary, lastSalaryAdjustment, performance, ...publicData } = analyst;
          return publicData;
        }
        return analyst;
      });
      
      res.json(filteredAnalysts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch analysts" });
    }
  });

  app.get("/api/analysts/:id", authenticate, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const analyst = await storage.getAnalyst(id);
      
      if (!analyst) {
        return res.status(404).json({ message: "Analyst not found" });
      }
      
      // Filter sensitive information based on user role
      if (req.user!.role === 'analyst') {
        const { currentSalary, lastSalaryAdjustment, performance, ...publicData } = analyst;
        return res.json(publicData);
      }
      
      res.json(analyst);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch analyst" });
    }
  });

  app.post("/api/analysts", authenticate, requireRole(['admin', 'manager']), async (req: AuthenticatedRequest, res: Response) => {
    try {
      const validatedData = insertAnalystSchema.parse(req.body);
      const analyst = await storage.createAnalyst(validatedData);
      res.status(201).json(analyst);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: "Failed to create analyst" });
      }
    }
  });

  app.put("/api/analysts/:id", authenticate, requireRole(['admin', 'manager']), async (req: AuthenticatedRequest, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertAnalystSchema.partial().parse(req.body);
      const analyst = await storage.updateAnalyst(id, validatedData);
      res.json(analyst);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: "Failed to update analyst" });
      }
    }
  });

  app.delete("/api/analysts/:id", authenticate, requireRole(['admin', 'manager']), async (req: AuthenticatedRequest, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteAnalyst(id);
      
      if (!deleted) {
        return res.status(404).json({ message: "Analyst not found" });
      }
      
      res.json({ message: "Analyst deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete analyst" });
    }
  });

  // Vacation periods routes
  app.get("/api/analysts/:id/vacation-periods", authenticate, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const analystId = parseInt(req.params.id);
      const periods = await storage.getVacationPeriods(analystId);
      res.json(periods);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch vacation periods" });
    }
  });

  app.post("/api/analysts/:id/vacation-periods", authenticate, requireRole(['admin', 'manager']), async (req: AuthenticatedRequest, res: Response) => {
    try {
      const analystId = parseInt(req.params.id);
      const validatedData = insertVacationPeriodSchema.parse({
        ...req.body,
        analystId
      });
      const period = await storage.createVacationPeriod(validatedData);
      res.status(201).json(period);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: "Failed to create vacation period" });
      }
    }
  });

  // Salary history routes
  app.get("/api/analysts/:id/salary-history", authenticate, requireRole(['admin', 'manager']), async (req: AuthenticatedRequest, res: Response) => {
    try {
      const analystId = parseInt(req.params.id);
      const history = await storage.getSalaryHistory(analystId);
      res.json(history);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch salary history" });
    }
  });

  app.post("/api/analysts/:id/salary-history", authenticate, requireRole(['admin', 'manager']), async (req: AuthenticatedRequest, res: Response) => {
    try {
      const analystId = parseInt(req.params.id);
      const validatedData = insertSalaryHistorySchema.parse({
        ...req.body,
        analystId
      });
      
      // Update analyst's current salary
      const analyst = await storage.getAnalyst(analystId);
      if (analyst) {
        await storage.updateAnalyst(analystId, {
          currentSalary: validatedData.newAmount,
          lastSalaryAdjustment: validatedData.adjustmentDate
        });
      }
      
      const entry = await storage.createSalaryHistoryEntry(validatedData);
      res.status(201).json(entry);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: "Failed to create salary history entry" });
      }
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
