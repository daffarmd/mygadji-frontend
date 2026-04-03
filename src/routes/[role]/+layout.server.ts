import { dev } from '$app/environment';
import { error } from '@sveltejs/kit';

import { APP_ROLE_COOKIE, normalizeRole } from '$lib/auth/roles';

import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = ({ params, cookies, locals }) => {
	const role = normalizeRole(params.role);

	if (!role) {
		throw error(404, 'Role not found');
	}

	cookies.set(APP_ROLE_COOKIE, role, {
		path: '/',
		httpOnly: true,
		sameSite: 'lax',
		secure: !dev,
		maxAge: 60 * 60 * 24 * 30
	});

	locals.user = { role };

	return { role };
};
