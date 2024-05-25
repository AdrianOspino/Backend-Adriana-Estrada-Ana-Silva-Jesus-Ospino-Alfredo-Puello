
from app.db.database import Base
from sqlalchemy import Column, Integer, String, Boolean, DateTime
from datetime import datetime
from sqlalchemy.schema import ForeignKey
from sqlalchemy.orm import relationship

class User(Base):
    __tablename__= "usuario"
    id = Column(Integer, primary_key=True, autoincrement=True)
    username = Column(String(255),unique=True)
    password = Column(String(255))
    nombre = Column(String(255))
    apellido = Column(String(255))
    direccion = Column(String(255))
    telefono = Column(String(255))
    correo = Column(String(255),unique=True)
    creacion = Column(DateTime, default=datetime.now, onupdate=datetime.now)
    estado = Column(Boolean, default=False)
    venta = relationship("venta",backref="usuario",cascade="delete,merge")

    class venta(Base):
        __tablename__ = "venta"
        id = Column(Integer, primary_key=True, autoincrement=True)
        usuario_id = Column(Integer,ForeignKey("usuario.id",ondelete="CASCADE"))
        venta = Column(Integer)
        ventas_productos = Column(Integer)
        