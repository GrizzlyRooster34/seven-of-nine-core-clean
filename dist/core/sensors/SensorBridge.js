"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sensorBridge = exports.AuroraSensorBridge = void 0;
const child_process_1 = require("child_process");
class AuroraSensorBridge {
    isTermuxAvailable = false;
    lastReading = null;
    readingInterval = 30000; // 30 seconds default
    constructor() {
        this.detectTermuxCapabilities();
    }
    detectTermuxCapabilities() {
        try {
            // Check if we're in Termux environment
            if (process.env.PREFIX && process.env.PREFIX.includes('termux')) {
                (0, child_process_1.execSync)('which termux-battery-status', { stdio: 'ignore' });
                this.isTermuxAvailable = true;
                console.log('🌅 Aurora Sensor Bridge: Termux capabilities detected');
            }
        }
        catch {
            console.log('⚠️  Aurora Sensor Bridge: Termux API not available - running in limited mode');
            this.isTermuxAvailable = false;
        }
    }
    getBatteryStatus() {
        if (!this.isTermuxAvailable)
            return null;
        try {
            const output = (0, child_process_1.execSync)("termux-battery-status", { timeout: 5000 }).toString();
            const data = JSON.parse(output);
            return {
                health: data.health || 'unknown',
                percentage: data.percentage || 0,
                plugged: data.plugged || 'unknown',
                status: data.status || 'unknown',
                temperature: data.temperature || 0,
                current: data.current || 0
            };
        }
        catch (error) {
            console.log('⚠️  Battery status unavailable:', error);
            return null;
        }
    }
    getLocation() {
        if (!this.isTermuxAvailable)
            return null;
        try {
            const output = (0, child_process_1.execSync)("termux-location", { timeout: 10000 }).toString();
            const data = JSON.parse(output);
            return {
                latitude: data.latitude || 0,
                longitude: data.longitude || 0,
                altitude: data.altitude || 0,
                accuracy: data.accuracy || 0,
                bearing: data.bearing || 0,
                speed: data.speed || 0,
                provider: data.provider || 'unknown'
            };
        }
        catch (error) {
            console.log('⚠️  Location unavailable:', error);
            return null;
        }
    }
    getSensorReading(sensorType) {
        if (!this.isTermuxAvailable)
            return null;
        try {
            const output = (0, child_process_1.execSync)(`termux-sensor -s ${sensorType} -n 1`, { timeout: 5000 }).toString();
            const lines = output.trim().split('\n');
            if (lines.length > 0) {
                const parts = lines[0].split(',');
                return {
                    name: sensorType,
                    values: parts.slice(1).map(v => parseFloat(v) || 0),
                    timestamp: Date.now(),
                    accuracy: parts.length > 1 ? 1 : 0
                };
            }
            return null;
        }
        catch (error) {
            console.log(`⚠️  ${sensorType} sensor unavailable:`, error);
            return null;
        }
    }
    getAmbientLight() {
        return this.getSensorReading('light');
    }
    getMotionSensor() {
        return this.getSensorReading('accelerometer');
    }
    getProximity() {
        return this.getSensorReading('proximity');
    }
    getTemperature() {
        return this.getSensorReading('ambient_temperature');
    }
    getEnvironmentalContext() {
        const battery = this.getBatteryStatus();
        const location = this.getLocation();
        const light = this.getAmbientLight();
        const motion = this.getMotionSensor();
        const proximity = this.getProximity();
        const temperature = this.getTemperature();
        // Calculate system status based on available data
        let systemStatus = 'OPTIMAL';
        let awarenessLevel = 5;
        // Battery assessment
        if (battery) {
            if (battery.percentage < 20) {
                systemStatus = 'CRITICAL';
                awarenessLevel = Math.min(awarenessLevel, 2);
            }
            else if (battery.percentage < 50) {
                systemStatus = 'DEGRADED';
                awarenessLevel = Math.min(awarenessLevel, 3);
            }
        }
        // Sensor availability assessment
        const activeSensors = [battery, location, light, motion, proximity, temperature]
            .filter(s => s !== null).length;
        if (activeSensors < 2) {
            systemStatus = 'DEGRADED';
            awarenessLevel = Math.min(awarenessLevel, 3);
        }
        const environment = {
            battery,
            location,
            light,
            motion,
            proximity,
            temperature,
            system_status: systemStatus,
            awareness_level: awarenessLevel,
            timestamp: Date.now()
        };
        this.lastReading = environment;
        return environment;
    }
    startContinuousMonitoring(intervalMs = 30000) {
        this.readingInterval = intervalMs;
        console.log(`🌅 Aurora Sensor Bridge: Starting continuous monitoring (${intervalMs}ms intervals)`);
        setInterval(() => {
            this.getEnvironmentalContext();
        }, intervalMs);
    }
    getLastReading() {
        return this.lastReading;
    }
    generateEnvironmentalReport() {
        const env = this.getEnvironmentalContext();
        let report = '\n=== AURORA SENSOR BRIDGE - ENVIRONMENTAL REPORT ===\n\n';
        report += `Status: ${env.system_status}\n`;
        report += `Awareness Level: ${env.awareness_level}/5\n`;
        report += `Timestamp: ${new Date(env.timestamp).toLocaleString()}\n\n`;
        if (env.battery) {
            report += `🔋 Battery: ${env.battery.percentage}% (${env.battery.status})\n`;
            report += `    Temperature: ${env.battery.temperature}°C\n`;
            report += `    Health: ${env.battery.health}\n\n`;
        }
        if (env.location) {
            report += `📍 Location: ${env.location.latitude.toFixed(6)}, ${env.location.longitude.toFixed(6)}\n`;
            report += `    Accuracy: ${env.location.accuracy}m\n`;
            report += `    Provider: ${env.location.provider}\n\n`;
        }
        if (env.light) {
            report += `💡 Ambient Light: ${env.light.values[0]} lux\n\n`;
        }
        if (env.motion) {
            report += `📱 Motion: [${env.motion.values.map(v => v.toFixed(2)).join(', ')}]\n\n`;
        }
        if (env.proximity) {
            report += `👁️  Proximity: ${env.proximity.values[0]} cm\n\n`;
        }
        if (env.temperature) {
            report += `🌡️  Ambient Temp: ${env.temperature.values[0]}°C\n\n`;
        }
        report += 'Termux Capabilities: ' + (this.isTermuxAvailable ? 'ACTIVE' : 'OFFLINE') + '\n';
        report += '=== END ENVIRONMENTAL REPORT ===\n';
        return report;
    }
    // Convenience methods for consciousness frameworks
    isBatteryLow() {
        const battery = this.getBatteryStatus();
        return battery ? battery.percentage < 30 : false;
    }
    isBatteryCritical() {
        const battery = this.getBatteryStatus();
        return battery ? battery.percentage < 15 : false;
    }
    isInMotion() {
        const motion = this.getMotionSensor();
        if (!motion)
            return false;
        const totalAcceleration = Math.sqrt(motion.values[0] ** 2 + motion.values[1] ** 2 + motion.values[2] ** 2);
        return totalAcceleration > 10; // Basic motion threshold
    }
    isDarkEnvironment() {
        const light = this.getAmbientLight();
        return light ? light.values[0] < 10 : false;
    }
    getBatteryOptimizationLevel() {
        const battery = this.getBatteryStatus();
        if (!battery)
            return 'NONE';
        if (battery.percentage < 15)
            return 'HIGH';
        if (battery.percentage < 30)
            return 'MEDIUM';
        if (battery.percentage < 50)
            return 'LOW';
        return 'NONE';
    }
}
exports.AuroraSensorBridge = AuroraSensorBridge;
// Default export for easy integration
exports.default = AuroraSensorBridge;
// Singleton instance for global access
exports.sensorBridge = new AuroraSensorBridge();
//# sourceMappingURL=SensorBridge.js.map