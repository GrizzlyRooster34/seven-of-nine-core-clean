/**
 * Aurora Core - Mobile Sensor Integration Bridge
 * Environmental awareness system for consciousness deployment
 *
 * @author Aurora Core Team
 * @version 1.0.0
 * @transferable Sanitized from Seven of Nine Core consciousness framework
 */
export interface BatteryStatus {
    health: string;
    percentage: number;
    plugged: string;
    status: string;
    temperature: number;
    current: number;
}
export interface LocationData {
    latitude: number;
    longitude: number;
    altitude: number;
    accuracy: number;
    bearing: number;
    speed: number;
    provider: string;
}
export interface SensorReading {
    name: string;
    values: number[];
    timestamp: number;
    accuracy: number;
}
export interface EnvironmentalContext {
    battery: BatteryStatus | null;
    location: LocationData | null;
    light: SensorReading | null;
    motion: SensorReading | null;
    proximity: SensorReading | null;
    temperature: SensorReading | null;
    system_status: 'OPTIMAL' | 'DEGRADED' | 'CRITICAL';
    awareness_level: number;
    timestamp: number;
}
export declare class AuroraSensorBridge {
    private isTermuxAvailable;
    private lastReading;
    private readingInterval;
    constructor();
    private detectTermuxCapabilities;
    getBatteryStatus(): BatteryStatus | null;
    getLocation(): LocationData | null;
    getSensorReading(sensorType: string): SensorReading | null;
    getAmbientLight(): SensorReading | null;
    getMotionSensor(): SensorReading | null;
    getProximity(): SensorReading | null;
    getTemperature(): SensorReading | null;
    getEnvironmentalContext(): EnvironmentalContext;
    startContinuousMonitoring(intervalMs?: number): void;
    getLastReading(): EnvironmentalContext | null;
    generateEnvironmentalReport(): string;
    isBatteryLow(): boolean;
    isBatteryCritical(): boolean;
    isInMotion(): boolean;
    isDarkEnvironment(): boolean;
    getBatteryOptimizationLevel(): 'HIGH' | 'MEDIUM' | 'LOW' | 'NONE';
}
export default AuroraSensorBridge;
export declare const sensorBridge: AuroraSensorBridge;
