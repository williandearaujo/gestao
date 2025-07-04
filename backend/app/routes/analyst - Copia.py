# backend/app/routes/analyst.py - CRUD completo com Swagger documentado

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app import models, schemas

# 🔧 Prefixo removido — definido no main.py
router = APIRouter(tags=["Analysts"])


# 1. GET: Listar todos os analistas
@router.get(
    "/",
    response_model=list[schemas.AnalystOut],
    summary="Listar analistas",
    description="Retorna todos os analistas cadastrados no sistema.",
)
def list_analysts(db: Session = Depends(get_db)):
    return db.query(models.Analyst).all()


# 2. POST: Criar novo analista
@router.post(
    "/",
    response_model=schemas.AnalystOut,
    summary="Criar analista",
    description="Cria um novo analista com os dados fornecidos.",
)
def create_analyst(analyst: schemas.AnalystCreate, db: Session = Depends(get_db)):
    db_analyst = models.Analyst(**analyst.dict())
    db.add(db_analyst)
    db.commit()
    db.refresh(db_analyst)
    return db_analyst


# 3. GET: Obter analista por ID
@router.get(
    "/{analyst_id}",
    response_model=schemas.AnalystOut,
    summary="Obter analista",
    description="Retorna os dados de um analista específico.",
)
def get_analyst(analyst_id: int, db: Session = Depends(get_db)):
    analyst = db.query(models.Analyst).filter(models.Analyst.id == analyst_id).first()
    if not analyst:
        raise HTTPException(status_code=404, detail="Analista não encontrado")
    return analyst


# 4. PUT: Atualizar analista por ID
@router.put(
    "/{analyst_id}",
    response_model=schemas.AnalystOut,
    summary="Atualizar analista",
    description="Atualiza os dados de um analista existente.",
)
def update_analyst(analyst_id: int, updated: schemas.AnalystCreate, db: Session = Depends(get_db)):
    analyst = db.query(models.Analyst).filter(models.Analyst.id == analyst_id).first()
    if not analyst:
        raise HTTPException(status_code=404, detail="Analista não encontrado")
    for field, value in updated.dict().items():
        setattr(analyst, field, value)
    db.commit()
    db.refresh(analyst)
    return analyst


# 5. DELETE: Remover analista por ID
@router.delete(
    "/{analyst_id}",
    summary="Deletar analista",
    description="Remove um analista do banco de dados.",
)
def delete_analyst(analyst_id: int, db: Session = Depends(get_db)):
    analyst = db.query(models.Analyst).filter(models.Analyst.id == analyst_id).first()
    if not analyst:
        raise HTTPException(status_code=404, detail="Analista não encontrado")
    db.delete(analyst)
    db.commit()
    return {"message": "Analista deletado com sucesso"}
