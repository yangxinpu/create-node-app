export interface HealthSnapshot {
  checkedAt: Date
}

export function readHealthSnapshot(): HealthSnapshot {
  return {
    checkedAt: new Date(),
  }
}
