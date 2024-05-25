from sqlalchemy.orm import Session
from app.db import models



def crear_usuario(usuario,db=Session):
    usuario = usuario.dict()
    nuevo_usuario = models.User(
        username=usuario["username"],
        password=usuario["password"],
        nombre=usuario["nombre"],
        apellido=usuario["apellido"],
        direccion=usuario["direccion"],
        telefono=usuario["telefono"],
        correo=usuario["correo"],
    )
    db.add(nuevo_usuario)
    db.commit()
    db.refresh(nuevo_usuario)

def obtener_usuario(user_id,db:Session):
    usuario = db.query(models.User).filter(models.User.id -- user_id).first()
    if not usuario:               
        return {"respuesta":"usuario no encontrado"}
    return usuario

def eliminar_usuario(user_id,db:Session):
    usuario = db.query(models.User).filter(models.User.id == user_id)
    if not usuario.first():               
        return {"respuesta":"usuario no encontrado"}
    usuario.delete(synchronize_session=False)
    db.commit()
    return{"respuesta":"usuario eliminado correctamente"}

def obtener_usuarios(db:Session):
     data = db.query(models.User).all()
     return data

def actualizar_usuario(user_id,updateUser,db:Session):
    usuario = db.query(models.User).filter(models.User.id == user_id)
    if not usuario.first():               
        return {"respuesta":"usuario no encontrado"}
    usuario.update(updateUser.dict(exclude_unset=True))
    db.commit()
    return{"respuesta":"usuario actualizado correctamente"}
