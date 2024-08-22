import { login } from "@/app/lib/auth";
import { redirect } from "next/navigation";

export default function LoginPage() {
  return (
    <section className="flex flex-col items-center justify-center h-screen flex-grow">
      <h1>Inicia sesion para continuar</h1>
      <form
        action={async (formData) => {
          'use server';
          await login(formData);
          redirect("/companies");
        }}
        className="flex flex-col mt-4 space-y-4">
        <input
          type="text"
          name="username"
          placeholder="Nombre de usuario"
          className="border p-2 rounded"
        />
        <input
          type="password"
          name="password"
          placeholder="Contraseña"
          className="border p-2 rounded"
        />
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">
          Iniciar sesión
        </button>
      </form>
    </section>

  );
}
