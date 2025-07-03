export interface SessionMetadata {
  ip: string;
  country: string;
  city: string;
  browser: string;
  os: string;
  device: string;
  timestamp: Date;
}

export interface DeviceInfo {
  browser: string;
  os: string;
  device: string;
}

export interface LocationInfo {
  country: string;
  city: string;
  ip: string;
}