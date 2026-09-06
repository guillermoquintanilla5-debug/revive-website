export function isLegacyCss() {
  return (
    typeof document !== "undefined" &&
    document.documentElement.classList.contains("legacy-css")
  );
}
