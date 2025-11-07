/**
 * Environment Detection Utility
 * Determines if the system is running in a private/local environment
 */

export function isPrivateEnv(): boolean {
  // Check for environment variables that indicate private environment
  return (
    process.env.NODE_ENV === 'development' ||
    process.env.SEVEN_ENV === 'private' ||
    process.env.SEVEN_ENV === 'local' ||
    false
  );
}

export default isPrivateEnv;
