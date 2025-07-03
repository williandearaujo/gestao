from sqlalchemy import Column, Integer, String, Boolean, Date, Numeric, Text, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from .database import Base

class Analyst(Base):
    __tablename__ = "analysts"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    position = Column(String, nullable=False)
    start_date = Column(Date, nullable=False)
    is_active = Column(Boolean, default=True)
    day_off_enabled = Column(Boolean, default=False)
    observations = Column(Text)
    performance = Column(String)
    current_salary = Column(Numeric(10, 2))
    last_salary_adjustment = Column(Date)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow)

    vacation_periods = relationship("VacationPeriod", back_populates="analyst", cascade="all, delete")
    salary_history = relationship("SalaryHistory", back_populates="analyst", cascade="all, delete")


class VacationPeriod(Base):
    __tablename__ = "vacation_periods"

    id = Column(Integer, primary_key=True, index=True)
    analyst_id = Column(Integer, ForeignKey("analysts.id"))
    start_date = Column(Date)
    end_date = Column(Date)
    created_at = Column(DateTime, default=datetime.utcnow)

    analyst = relationship("Analyst", back_populates="vacation_periods")


class SalaryHistory(Base):
    __tablename__ = "salary_history"

    id = Column(Integer, primary_key=True, index=True)
    analyst_id = Column(Integer, ForeignKey("analysts.id"))
    previous_amount = Column(Numeric(10, 2))
    new_amount = Column(Numeric(10, 2), nullable=False)
    adjustment_date = Column(Date, nullable=False)
    notes = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)

    analyst = relationship("Analyst", back_populates="salary_history")
