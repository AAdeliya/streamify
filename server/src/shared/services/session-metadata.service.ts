import { Injectable } from '@nestjs/common';
import { Request } from 'express';
import * as geoip from 'geoip-lite';
import * as DeviceDetector from 'device-detector-js';
import { SessionMetadata, DeviceInfo, LocationInfo } from '../types/session-metadata.types';
import * as countries from 'i18n-iso-countries';

// Register the English locale for country names
countries.registerLocale(require('i18n-iso-countries/langs/en.json'));

@Injectable()
export class SessionMetadataService {
  private readonly deviceDetector = new DeviceDetector();

  public getSessionMetadata(req: Request, userAgent?: string): SessionMetadata {
    const ip = this.getClientIp(req);
    const location = this.getLocationInfo(ip);
    const device = this.getDeviceInfo(userAgent || req.headers['user-agent'] || '');

    return {
      ip,
      ...location,
      ...device,
      timestamp: new Date(),
    };
  }

  private getClientIp(req: Request): string {
    const forwarded = req.headers['x-forwarded-for'];
    if (forwarded) {
      return Array.isArray(forwarded) ? forwarded[0] : forwarded.split(',')[0];
    }
    return req.headers['x-real-ip'] as string || req.connection.remoteAddress || 'Unknown';
  }

  private getLocationInfo(ip: string): LocationInfo {
    const geo = geoip.lookup(ip);
    if (!geo) {
      return { country: 'Unknown', city: 'Unknown', ip };
    }

    // Use the actual country code from geoip lookup
    const countryName = countries.getName(geo.country, 'en') || geo.country;
    const city = geo.city || 'Unknown';

    return { country: countryName, city, ip };
  }

  private getDeviceInfo(userAgent: string): DeviceInfo {
    const result = this.deviceDetector.parse(userAgent);
    
    return {
      browser: result.client?.name || 'Unknown Browser',
      os: result.os?.name || 'Unknown OS',
      device: result.device?.type || 'desktop',
    };
  }
}