# [3] routes/protected.py – Rota protegida com autenticação Clerk

from fastapi import APIRouter, Depends
from auth import get_current_user
from fastapi.responses import JSONResponse

router = APIRouter()

@router.get("/protegido")
async def rota_protegida(user=Depends(get_current_user)):
    return {
        "mensagem": f"Bem-vindo, {user.get('sub')}✅ Acesso autorizado!",
        "user_info": user
    }
