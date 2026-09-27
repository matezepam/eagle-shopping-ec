import type { LocalProduct } from "~/features/catalog/catalog.local";

export type BagItem = {
  lineId: string;
  productId: string;
  slug: string;
  name: string;
  price: number;
  quantity: number;
  size: string;
  color: string;
  image: string;
  imageAlt: string;
};

export const useCommerceState = () => {
  const bag = useState<BagItem[]>("eagle-bag", () => []);
  const favoriteIds = useState<string[]>("eagle-favorites", () => []);

  const quantity = computed(() =>
    bag.value.reduce((total, item) => total + item.quantity, 0),
  );
  const subtotal = computed(() =>
    bag.value.reduce((total, item) => total + item.price * item.quantity, 0),
  );

  const addToBag = (product: LocalProduct, size: string, color: string) => {
    const lineId = `${product.id}-${size}-${color}`;
    const existing = bag.value.find((item) => item.lineId === lineId);
    if (existing) {
      existing.quantity += 1;
      return;
    }
    bag.value.push({
      lineId,
      productId: product.id,
      slug: product.slug,
      name: product.name,
      price: product.price,
      quantity: 1,
      size,
      color,
      image: product.images[0]?.url ?? "",
      imageAlt: product.images[0]?.alt ?? product.name,
    });
  };

  const removeFromBag = (lineId: string) => {
    bag.value = bag.value.filter((item) => item.lineId !== lineId);
  };

  const setQuantity = (lineId: string, nextQuantity: number) => {
    if (nextQuantity < 1) {
      removeFromBag(lineId);
      return;
    }
    const item = bag.value.find((entry) => entry.lineId === lineId);
    if (item) item.quantity = nextQuantity;
  };

  const isFavorite = (productId: string) =>
    favoriteIds.value.includes(productId);
  const toggleFavorite = (productId: string) => {
    favoriteIds.value = isFavorite(productId)
      ? favoriteIds.value.filter((id) => id !== productId)
      : [...favoriteIds.value, productId];
  };

  return {
    bag,
    favoriteIds,
    quantity,
    subtotal,
    addToBag,
    removeFromBag,
    setQuantity,
    isFavorite,
    toggleFavorite,
  };
};
