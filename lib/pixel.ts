export type FacebookEventName =
  | 'PageView'
  | 'InitiateCheckout'
  | 'Contact'
  | 'AddToCart'
  | 'AddPaymentInfo'
  | 'AddToWishlist'
  | 'CompleteRegistration'
  | 'CustomizeProduct'
  | 'Donate'
  | 'FindLocation'
  | 'Lead'

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void
  }
}

export function trackFacebookEvent(
  eventName: FacebookEventName,
  params?: Record<string, unknown>
) {
  if (typeof window === 'undefined') return
  if (typeof window.fbq !== 'function') return
  try {
    if (params) {
      window.fbq('track', eventName, params)
    } else {
      window.fbq('track', eventName)
    }
  } catch (_) {
    // swallow tracking errors
  }
}


