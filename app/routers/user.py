from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.schemas import User, UpdateUser
from app.db.database import get_db
from app.repository import user
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from app.auth import get_user
from app.core.config import settings

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

router = APIRouter(
    prefix="/user",
    tags=["Users"]
)

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=401,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    user = get_user(db, username=username)
    if user is None:
        raise credentials_exception
    return user

@router.get('/v1/usuarios', dependencies=[Depends(get_current_user)])
def obtener_usuarios(db: Session = Depends(get_db)):
    data = user.obtener_usuarios(db)
    return data

@router.post('/v1/crearUsuario', dependencies=[Depends(get_current_user)])
def crear_usuario(usuario: User, db: Session = Depends(get_db)):
    user.crear_usuario(usuario, db)
    return {"respuesta": "Usuario creado correctamente!!"}

@router.get('/v1/obtenerUsuario/{user_id}', dependencies=[Depends(get_current_user)])  
def obtener_usuario(user_id: int, db: Session = Depends(get_db)):
    usuario = user.obtener_usuario(user_id, db)
    return usuario

@router.delete('/v1/eliminarUsuario/{user_id}', dependencies=[Depends(get_current_user)]) 
def eliminar_usuario(user_id: int, db: Session = Depends(get_db)):
    res = user.eliminar_usuario(user_id, db)
    return res

@router.patch('/v1/actualizarUsuario/{user_id}', dependencies=[Depends(get_current_user)]) 
def actualizar_usuario(user_id: int, updateUser: UpdateUser, db: Session = Depends(get_db)):
    res = user.actualizar_usuario(user_id, updateUser, db)
    return res
