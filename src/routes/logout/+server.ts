import { redirect } from '@sveltejs/kit';

import { APP_ROLE_COOKIE } from '$lib/auth/roles';

import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ cookies }) => {
	cookies.delete(APP_ROLE_COOKIE, { path: '/' });
	throw redirect(303, '/');
};
