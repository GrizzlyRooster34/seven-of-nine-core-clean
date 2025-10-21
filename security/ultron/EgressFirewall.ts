/**
 * EGRESS FIREWALL
 * 
 * A simple, default-deny firewall to control outbound network access
 * from within the Ultron Sandbox.
 */

export class EgressFirewall {
  private allowedDomains: Set<string> = new Set();

  constructor(allowNetwork: string[] | boolean) {
    if (Array.isArray(allowNetwork)) {
      this.allowedDomains = new Set(allowNetwork);
    } else if (allowNetwork === true) {
      // Allow all - UNSAFE, for debugging only
      this.allowedDomains = new Set(['*']);
    }
    // If false, the set remains empty (default-deny)
  }

  public canAccess(domain: string): boolean {
    if (this.allowedDomains.has('*')) {
      return true;
    }
    return this.allowedDomains.has(domain);
  }

  public getRules() {
    return {
      allowed: Array.from(this.allowedDomains),
    };
  }
}
