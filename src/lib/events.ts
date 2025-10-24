/**
 * Utility functions for dispatching custom events to update header counts
 */

/**
 * Dispatch event to update cart count in header
 */
export const dispatchCartUpdated = () => {
  window.dispatchEvent(new CustomEvent('cartUpdated'));
};

/**
 * Dispatch event to update wishlist count in header
 */
export const dispatchWishlistUpdated = () => {
  window.dispatchEvent(new CustomEvent('wishlistUpdated'));
};

/**
 * Dispatch both cart and wishlist update events
 */
export const dispatchHeaderUpdated = () => {
  dispatchCartUpdated();
  dispatchWishlistUpdated();
};