// Re-export the enhanced permission system
export * from './permissions-v2';

// Keep the old interface for backward compatibility
import { EnhancedPermissionManager, createEnhancedPermissionManager, PermissionContext } from './permissions-v2';

/**
 * @deprecated Use EnhancedPermissionManager instead
 */
export class PermissionManager extends EnhancedPermissionManager {
  constructor(context: PermissionContext) {
    super(context);
  }
}

/**
 * @deprecated Use createEnhancedPermissionManager instead
 */
export function createPermissionManager(authContext: PermissionContext): EnhancedPermissionManager {
  return createEnhancedPermissionManager(authContext);
}
