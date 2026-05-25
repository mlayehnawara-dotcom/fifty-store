import { CartItem } from '../context/CartContext';
import { STORE_INFO } from '../data/store';
import { formatPrice } from './format';
import type { Product } from '../data/products';

interface CustomerOrderInfo {
  fullName: string;
  phone: string;
  city: string;
  address: string;
  notes?: string;
}

export function buildWhatsAppOrderMessage(customer: CustomerOrderInfo, items: CartItem[], total: number): string {
  const lines = items
    .map((item, index) => {
      const itemTotal = item.product.price * item.quantity;
      return [
        `${index + 1}. ${item.product.name}`,
        `   Quantite: ${item.quantity}`,
        `   Prix unitaire: ${formatPrice(item.product.price)}`,
        `   Sous-total: ${formatPrice(itemTotal)}`,
      ].join('\n');
    })
    .join('\n\n');

  const notesLine = customer.notes?.trim() ? `Notes: ${customer.notes.trim()}` : 'Notes: -';

  return [
    'Nouvelle commande - Fifty Store',
    '',
    `Client: ${customer.fullName}`,
    `Telephone: ${customer.phone}`,
    `Ville: ${customer.city}`,
    `Adresse: ${customer.address}`,
    notesLine,
    '',
    'Produits:',
    lines,
    '',
    `Total: ${formatPrice(total)}`,
    `Paiement: ${STORE_INFO.paymentLabel}`,
    `Livraison: ${STORE_INFO.deliveryLabel}`,
  ].join('\n');
}

export function buildDirectProductMessage(product: Product, quantity = 1): string {
  return [
    'Bonjour Fifty Store,',
    '',
    'Je souhaite commander ce produit:',
    `Produit: ${product.name}`,
    `Marque: ${product.brand}`,
    `Prix unitaire: ${formatPrice(product.price)}`,
    `Quantite: ${quantity}`,
    `Total: ${formatPrice(product.price * quantity)}`,
    `Paiement: ${STORE_INFO.paymentLabel}`,
    `Livraison: ${STORE_INFO.deliveryLabel}`,
  ].join('\n');
}

export function buildSetupMessage(products: Product[]): string {
  const lines = products.map((product, index) => `${index + 1}. ${product.name} - ${formatPrice(product.price)}`);
  const total = products.reduce((sum, product) => sum + product.price, 0);

  return [
    'Bonjour Fifty Store,',
    '',
    'Je souhaite composer ce pack:',
    ...lines,
    '',
    `Total affiche: ${formatPrice(total)}`,
    `Paiement: ${STORE_INFO.paymentLabel}`,
    `Livraison: ${STORE_INFO.deliveryLabel}`,
    '',
    'Merci de confirmer la disponibilite et une eventuelle offre pack.',
  ].join('\n');
}

export function openWhatsApp(text: string): void {
  const encoded = encodeURIComponent(text);
  window.open(`https://wa.me/${STORE_INFO.whatsappNumber}?text=${encoded}`, '_blank', 'noopener,noreferrer');
}
