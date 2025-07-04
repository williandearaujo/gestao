# backend/app/routes/analyst.py
print("✅ analyst.py foi carregado!")



from fastapi import APIRouter
from typing import List

router = APIRouter(tags=["Analysts"])

@router.get(
    "/",
    response_model=List[dict],
    summary="Listar analistas (teste)",
    description="Versão mínima só pra confirmar registro no Swagger",
)
def list_analysts():
    return [{"id": 1, "name": "Teste"}]
