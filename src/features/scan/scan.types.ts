export type ScanMode = 'quick' | 'deep' | 'custom';
export type ResultStatus = 'pass' | 'warning' | 'fail' | 'unknown' | 'not_applicable';
export type Severity = 'critical' | 'high' | 'medium' | 'low' | 'info';
export type Confidence = 'high' | 'medium' | 'low';

export type ScanRequest = {
  target: string;
  mode: ScanMode;
};
