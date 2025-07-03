from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app import models, schemas

router = APIRouter()


# 🔹 GET: Listar todos os analistas
@router.get("/", response_model=list[schemas.AnalystOut], summary="Listar Analistas", tags=["Analistas"])
def list_analysts(db: Session = Depends(get_db)):
    return db.query(models.Analyst).all()


# 🔹 POST: Criar analista
@router.post("/", response_model=schemas.AnalystOut, summary="Criar Analista", tags=["Analistas"])
def create_analyst(analyst: schemas.AnalystCreate, db: Session = Depends(get_db)):
    try:
        db_analyst = models.Analyst(
            name=analyst.name,
            position=analyst.position,
            start_date=analyst.start_date,
            is_active=analyst.is_active,
            day_off_enabled=analyst.day_off_enabled,
            observations=analyst.observations,
            performance=analyst.performance,
            current_salary=analyst.current_salary,
            last_salary_adjustment=analyst.last_salary_adjustment,
        )
        db.add(db_analyst)
        db.commit()
        db.refresh(db_analyst)

        for period in analyst.vacationPeriods or []:
            vacation = models.VacationPeriod(
                analyst_id=db_analyst.id,
                start_date=period.start_date,
                end_date=period.end_date
            )
            db.add(vacation)
        db.commit()

        return db_analyst
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao criar analista: {str(e)}")


# 🔹 PUT: Atualizar analista
@router.put("/{analyst_id}", response_model=schemas.AnalystOut, summary="Atualizar Analista", tags=["Analistas"])
def update_analyst(analyst_id: int, updated_data: schemas.AnalystCreate, db: Session = Depends(get_db)):
    db_analyst = db.query(models.Analyst).filter(models.Analyst.id == analyst_id).first()
    if not db_analyst:
        raise HTTPException(status_code=404, detail="Analista não encontrado")

    for field, value in updated_data.model_dump().items():
        setattr(db_analyst, field, value)

    db.commit()
    db.refresh(db_analyst)
    return db_analyst


# 🔹 DELETE: Remover analista
@router.delete("/{analyst_id}", status_code=204, summary="Excluir Analista", tags=["Analistas"])
def delete_analyst(analyst_id: int, db: Session = Depends(get_db)):
    analyst = db.query(models.Analyst).filter(models.Analyst.id == analyst_id).first()
    if not analyst:
        raise HTTPException(status_code=404, detail="Analista não encontrado")
    db.delete(analyst)
    db.commit()
