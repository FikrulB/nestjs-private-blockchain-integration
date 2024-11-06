export async function separateDuration(duration: string): Promise<{ amount: number, unit: string }> {
  const durationRegex = /^(\d+)([smhd])$/;
  const match = duration.match(durationRegex);

  if (!match) {
    throw new Error('Invalid duration format. Must be in the format of [number][s|m|h|d]');
  }

  const amount = parseInt(match[1], 10);
  const unit = match[2];

  return { amount, unit };
}