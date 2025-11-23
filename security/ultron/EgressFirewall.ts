/**
 * EGRESS FIREWALL
 * 
 * A simple, default-deny firewall to control outbound network access
 * from within the Ultron Sandbox.
 */

import { isPrivateEnv } from '../../core/env/isPrivateEnv.js';

export class EgressFirewall {
  private allowedDomains: Set<string> = new Set();

  constructor(allowNetwork: string[] | boolean) {
    if (Array.isArray(allowNetwork)) {
      this.allowedDomains = new Set(allowNetwork);
    } else if (allowNetwork === true) {
      // Security Check: Only allow wildcard in private/dev environments
      if (isPrivateEnv()) {
        console.warn('⚠️ [SECURITY WARNING] EgressFirewall allowed all (*). This is UNSAFE and restricted to DEV only.');
        this.allowedDomains = new Set(['*']);
      } else {
        throw new Error('SECURITY VIOLATION: Wildcard network access is strictly prohibited in Production environments.');
      }
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
