# backend/app/schemas.py

from typing import Optional, List
from datetime import date, datetime
from pydantic import BaseModel, Field


# ========== FÉRIAS ==========
class VacationPeriodBase(BaseModel):
    startDate: date
    endDate: date


class VacationPeriodOut(VacationPeriodBase):
    id: int
    analystId: int

    class Config:
        from_attributes = True


# ========== SALÁRIO ==========
class SalaryHistoryBase(BaseModel):
    previousAmount: Optional[float] = None
    newAmount: float
    adjustmentDate: date
    notes: Optional[str] = None


class SalaryHistoryOut(SalaryHistoryBase):
    id: int
    analystId: int

    class Config:
        from_attributes = True


# ========== ENTRADA ==========
class AnalystCreate(BaseModel):
    name: str
    position: str
    startDate: date
    isActive: bool = True
    dayOffEnabled: bool = False
    observations: Optional[str] = None
    performance: Optional[str] = None
    currentSalary: Optional[float] = None
    lastSalaryAdjustment: Optional[date] = None
    vacationPeriods: Optional[List[VacationPeriodBase]] = []


# ========== SAÍDA ==========
class AnalystOut(BaseModel):
    id: int
    name: str
    position: str
    startDate: date = Field(..., alias="start_date")
    isActive: bool = Field(..., alias="is_active")
    dayOffEnabled: bool = Field(..., alias="day_off_enabled")
    observations: Optional[str]
    performance: Optional[str]
    currentSalary: Optional[float] = Field(None, alias="current_salary")
    lastSalaryAdjustment: Optional[date] = Field(None, alias="last_salary_adjustment")
    createdAt: datetime = Field(..., alias="created_at")
    updatedAt: datetime = Field(..., alias="updated_at")

    class Config:
        from_attributes = True
        populate_by_name = True  # ← Permite conversão automática de alias
