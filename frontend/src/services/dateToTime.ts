export function DateToTime(dateString: string): number {
    const deadline = new Date(dateString).getTime();
    const now = Date.now();
    const diffInMs = deadline - now;
    return diffInMs / (1000 * 60 * 60);
  }