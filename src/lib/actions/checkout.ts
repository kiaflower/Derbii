'use server';
import { generateOrderNumber } from '@/lib/utils/order';
export async function createOrderAction() {
  const orderNumber = generateOrderNumber(Number(Date.now().toString().slice(-4)));
  const msg = `Bonjour DERBII,%0AJe souhaite confirmer ma commande.%0A%0ACommande: ${orderNumber}`;
  const phone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '221770000000';
  return { ok: true, redirectUrl: `https://wa.me/${phone}?text=${msg}`, orderNumber };
}
