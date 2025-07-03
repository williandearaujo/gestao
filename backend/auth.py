# [2] routes/auth.py – Autenticação Clerk JWT

from fastapi import Request, HTTPException, status, APIRouter
from jose import jwt
from jose.exceptions import JWTError
import httpx
from fastapi import Depends


router = APIRouter()

# URL da chave pública JWKS do seu projeto Clerk
JWKS_URL = "https://clerk.enhanced-doe-80.clerk.accounts.dev/.well-known/jwks.json"
ALGORITHMS = ["RS256"]
AUDIENCE = "https://clerk.enhanced-doe-80.clerk.accounts.dev"  # igual ao domínio do seu projeto Clerk

# Middleware de autenticação
async def get_current_user(request: Request):
    auth_header = request.headers.get("Authorization")

    if not auth_header or not auth_header.startswith("Bearer "):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token ausente ou inválido")

    token = auth_header.split(" ")[1]

    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(JWKS_URL)
            jwks = response.json()

        headers = jwt.get_unverified_header(token)
        key = next((k for k in jwks["keys"] if k["kid"] == headers["kid"]), None)

        if key is None:
            raise HTTPException(status_code=401, detail="Chave pública não encontrada")

        public_key = {
            "kty": key["kty"],
            "kid": key["kid"],
            "use": key["use"],
            "n": key["n"],
            "e": key["e"]
        }

        payload = jwt.decode(
            token,
            key=public_key,
            algorithms=ALGORITHMS,
            audience=AUDIENCE,
            options={"verify_exp": True}
        )

        return payload  # contém user_id, email etc.

    except JWTError as e:
        raise HTTPException(status_code=401, detail=f"Token inválido: {str(e)}")

# Teste simples de rota protegida
@router.get("/protegido")
async def rota_protegida(user=Depends(get_current_user)):
    return {
        "mensagem": "Você acessou uma rota protegida com sucesso.",
        "usuario": user
    }
