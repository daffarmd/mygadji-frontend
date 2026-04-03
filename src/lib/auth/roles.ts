export const APP_ROLES = ['hrd', 'boss', 'employee'] as const;

export type AppRole = (typeof APP_ROLES)[number];

export const DEFAULT_ROLE: AppRole = 'hrd';
export const APP_ROLE_COOKIE = 'mygadji_role';

export function isAppRole(value: string | null | undefined): value is AppRole {
	return typeof value === 'string' && APP_ROLES.includes(value as AppRole);
}

export function normalizeRole(value: string | null | undefined): AppRole | null {
	return isAppRole(value) ? value : null;
}

export function getRolePath(role: AppRole) {
	return `/${role}`;
}
