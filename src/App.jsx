import { useState, useEffect } from "react";

function UsuariosItems({ id, username, password, nombre, apellido, direccion, telefono, correo, onDelete, onUpdate }) {
  return (
    <article className="w-96 bg-gray-100 rounded-xl shadow-lg shadow-rose-700 mx-auto mt-10 p-5">
      <h3 className="text-center text-2xl mb-5">Usuario</h3>
      <p>ID: {id}</p>
      <p>Username: {username}</p>
      <p>Password: {password}</p>
      <p>Nombre: {nombre}</p>
      <p>Apellido: {apellido}</p>
      <p>Direccion: {direccion}</p>
      <p>Telefono: {telefono}</p>
      <p>Correo: {correo}</p>
      <div className="flex justify-between my-5">
        <button className="bg-red-700 text-gray-100 w-32 font-semibold rounded-xl h-10" onClick={() => onDelete(id)}>Delete</button>
        <button className="bg-yellow-500 text-gray-100 w-32 font-semibold rounded-xl h-10" onClick={() => onUpdate(id)}>Update</button>
      </div>
    </article>
  );
}

function App() {
  const [usuarios, setUsuarios] = useState([]);
  const [dataForm, setDataForm] = useState({
    username: "",
    password: "",
    nombre: "",
    apellido: "",
    direccion: "",
    telefono: "",
    correo: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updateUserId, setUpdateUserId] = useState(null);

  const handlerFormInput = (e) => {
    setDataForm({
      ...dataForm,
      [e.target.name]: e.target.value,
    });
  };

  const handlerFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(updateUserId ? `http://localhost:8000/user/v1/actualizarUsuario/${updateUserId}` : "http://localhost:8000/user/v1/crearUsuario", {
        method: updateUserId ? "PATCH" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataForm),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      console.log(updateUserId ? "Usuario actualizado correctamente" : "Usuario creado correctamente", dataForm);
      obtenerUsuarios();

      setDataForm({
        username: "",
        password: "",
        nombre: "",
        apellido: "",
        direccion: "",
        telefono: "",
        correo: "",
      });

      setUpdateUserId(null);
    } catch (error) {
      console.error(updateUserId ? "Error al actualizar usuario" : "Error al crear usuario", error);
    }
  };

  const obtenerUsuarios = async () => {
    try {
      const response = await fetch("http://localhost:8000/user/v1/usuarios");
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const usuariosJson = await response.json();
      console.log("Usuarios obtenidos:", usuariosJson);
      setUsuarios(usuariosJson);
    } catch (error) {
      setError(error);
      console.error("Error al obtener usuarios:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const eliminarUsuario = async (id) => {
    try {
      const response = await fetch(`http://localhost:8000/user/v1/eliminarUsuario/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      console.log("Usuario eliminado correctamente");
      obtenerUsuarios();
    } catch (error) {
      console.error("Error al eliminar usuario:", error);
    }
  };

  const actualizarUsuario = (id) => {
    const usuario = usuarios.find((user) => user.id === id);
    setDataForm({
      username: usuario.username,
      password: usuario.password,
      nombre: usuario.nombre,
      apellido: usuario.apellido,
      direccion: usuario.direccion,
      telefono: usuario.telefono,
      correo: usuario.correo,
    });
    setUpdateUserId(id);
  };

  useEffect(() => {
    obtenerUsuarios();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <main className="w-full min-h-screen bg-rose-200 text-gray-800 pb-10">
      <h1 className="text-3xl font-bold text-center py-10">Mi App de Fastapi</h1>

      <form className="flex flex-col justify-center items-center px-5" onSubmit={handlerFormSubmit}>
        <input className="w-96 h-8 pl-3 text-gray-700 rounded-xl my-3" type="text" name="username" onChange={handlerFormInput} value={dataForm.username} placeholder="Username..." required />
        <input className="w-96 h-8 pl-3 text-gray-700 rounded-xl my-3" type="text" name="password" onChange={handlerFormInput} value={dataForm.password} placeholder="Password..." required />
        <input className="w-96 h-8 pl-3 text-gray-700 rounded-xl my-3" type="text" name="nombre" onChange={handlerFormInput} value={dataForm.nombre} placeholder="Nombre..." required />
        <input className="w-96 h-8 pl-3 text-gray-700 rounded-xl my-3" type="text" name="apellido" onChange={handlerFormInput} value={dataForm.apellido} placeholder="Apellido..." required />
        <input className="w-96 h-8 pl-3 text-gray-700 rounded-xl my-3" type="text" name="direccion" onChange={handlerFormInput} value={dataForm.direccion} placeholder="Direccion..." required />
        <input className="w-96 h-8 pl-3 text-gray-700 rounded-xl my-3" type="text" name="telefono" onChange={handlerFormInput} value={dataForm.telefono} placeholder="Telefono..." required />
        <input className="w-96 h-8 pl-3 text-gray-700 rounded-xl my-3" type="text" name="correo" onChange={handlerFormInput} value={dataForm.correo} placeholder="Correo..." required />
        <input className="h-10 w-32 bg-green-600 text-gray-100 rounded-xl font-semibold hover:cursor-pointer" type="submit" value={updateUserId ? "Update" : "Create"} />
      </form>
      <div>
        {usuarios.map((usuario) => (
          <UsuariosItems
            key={usuario.id}
            id={usuario.id}
            username={usuario.username}
            password={usuario.password}
            nombre={usuario.nombre}
            apellido={usuario.apellido}
            direccion={usuario.direccion}
            telefono={usuario.telefono}
            correo={usuario.correo}
            onDelete={eliminarUsuario}
            onUpdate={actualizarUsuario}

          />
        ))}
      </div>
    </main>
  );
}
export default App;