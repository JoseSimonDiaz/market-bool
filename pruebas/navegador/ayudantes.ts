import { expect, type Page } from '@playwright/test';
import { USUARIOS_DE_PRUEBA } from '@/constantes/datos-de-prueba';
import { ROL, type Rol } from '@/constantes/dominio';
import { RUTAS } from '@/constantes/rutas';

export function credencialesDe(rol: Rol) {
  const usuario = USUARIOS_DE_PRUEBA.find((candidato) => candidato.rol === rol);
  if (!usuario) throw new Error(`No hay usuario de prueba con rol ${rol}`);
  return usuario;
}

export function terminaEn(ruta: string) {
  return new RegExp(`${ruta.replace(/[?]/g, '\\?')}$`);
}

export async function intentarIngresar(
  pagina: Page,
  { email, password }: { email: string; password: string }
) {
  await pagina.goto(RUTAS.login);
  await pagina.getByLabel('Email').fill(email);
  await pagina.getByLabel('Contraseña').fill(password);
  await pagina.getByRole('button', { name: 'Ingresar' }).click();
}

export async function ingresarCon(
  pagina: Page,
  credenciales: { email: string; password: string }
) {
  await intentarIngresar(pagina, credenciales);
  await expect(pagina).toHaveURL(terminaEn(RUTAS.inicio));
}

export function ingresarComo(pagina: Page, rol: Rol) {
  return ingresarCon(pagina, credencialesDe(rol));
}

export async function salir(pagina: Page) {
  await pagina.getByRole('button', { name: 'Salir' }).click();
  await expect(pagina).toHaveURL(/\/login/);
}

export const ingresarComoAdmin = (pagina: Page) =>
  ingresarComo(pagina, ROL.admin);
export const ingresarComoVendedor = (pagina: Page) =>
  ingresarComo(pagina, ROL.vendedor);

export async function elegirOpcion(
  pagina: Page,
  etiqueta: string,
  opcion: string
) {
  await pagina.getByLabel(etiqueta, { exact: true }).click();
  await pagina.getByRole('option', { name: opcion, exact: true }).click();
}

export async function esperarAviso(pagina: Page, texto: string | RegExp) {
  await expect(pagina.getByText(texto).first()).toBeVisible();
}
