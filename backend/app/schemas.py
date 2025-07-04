# backend/app/schemas.py

from datetime import date, datetime
from pydantic import BaseModel, ConfigDict
from typing import List, Optional

# Vacation
class VacationPeriodBase(BaseModel):
    start_date: date
    end_date: date

class VacationPeriodOut(VacationPeriodBase):
    id: int
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)

# Salary
class SalaryHistoryBase(BaseModel):
    previous_amount: Optional[float] = None
    new_amount: float
    adjustment_date: date
    notes: Optional[str] = None

class SalaryHistoryOut(SalaryHistoryBase):
    id: int
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)

# Analyst - entrada
class AnalystCreate(BaseModel):
    name: str
    position: str
    start_date: date
    is_active: bool = True
    day_off_enabled: bool = False
    observations: Optional[str] = None
    performance: Optional[str] = None
    current_salary: Optional[float] = None
    last_salary_adjustment: Optional[date] = None

# Analyst - saída básica (usada no GET /api/analysts)
class AnalystOutBasic(AnalystCreate):
    id: int
    created_at: datetime
    updated_at: datetime
    model_config = ConfigDict(from_attributes=True)

# Analyst - saída detalhada (usada no GET único)
class AnalystOut(AnalystOutBasic):
    vacation_periods: List[VacationPeriodOut] = []
    salary_history: List[SalaryHistoryOut] = []
