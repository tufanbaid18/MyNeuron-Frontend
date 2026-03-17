export function getSidebarGATC({ index }: { index: number }): string {
  if (index == 1) {
    return "GATC Lite (M&M)-NISER";
  } else {
    return "GATC 2026";
  }
}
