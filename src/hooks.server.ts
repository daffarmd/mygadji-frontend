import type { Handle } from '@sveltejs/kit';

import { APP_ROLE_COOKIE, normalizeRole } from '$lib/auth/roles';

export const handle: Handle = async ({ event, resolve }) => {
	const role = normalizeRole(event.cookies.get(APP_ROLE_COOKIE));

	event.locals.user = role ? { role } : null;

	return resolve(event);
};
