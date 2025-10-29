export function useDeviceCheck() {
  const isMobile =
    /android|iphone|ipad|ipod|blackberry|windows phone|mobile/i.test(
      navigator.userAgent
    ) || window.innerWidth <= 768;

  return { isMobile, isDesktop: !isMobile };
}
