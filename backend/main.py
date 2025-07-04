# backend/main.py

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.routing import APIRoute
import logging

# ✅ Imports
from app.routes import protected, analyst
from auth import router as auth_router
from app.database import engine, Base
from app import models

# ✅ Criação automática das tabelas (apenas em dev)
Base.metadata.create_all(bind=engine)

# 🚀 Instância da aplicação FastAPI
app = FastAPI(
    title="Backend FastAPI com Gestão de Arquivos",
    description="API com autenticação e upload de arquivos",
    version="1.0.0",
)

# 🌐 CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Em produção, substitua pelos domínios permitidos
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ Registro de rotas
app.include_router(auth_router, prefix="/auth", tags=["Auth"])
app.include_router(protected.router, prefix="/api", tags=["Protegido"])
app.include_router(analyst.router, prefix="/api/analysts", tags=["Analysts"])  # Corrigido para Swagger exibir

# ✅ Rota de teste
@app.get("/", include_in_schema=False)
def read_root():
    return {"mensagem": "API FastAPI funcionando! 🚀", "status": "online"}

# 📝 Log de requisições
logging.basicConfig(level=logging.INFO)

@app.middleware("http")
async def log_request(request: Request, call_next):
    response = await call_next(request)
    logging.info(f"{request.method} {request.url} → {response.status_code}")
    return response

# 🔍 Exibe rotas no terminal ao iniciar
@app.on_event("startup")
async def show_routes():
    print("\n🔍 Rotas registradas:")
    for route in app.routes:
        if isinstance(route, APIRoute):
            print(f"🔹 {route.path} [{','.join(route.methods)}]")

            print("✅ Import do analyst.py feito no main.py")


# 🏃 Execução local
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
