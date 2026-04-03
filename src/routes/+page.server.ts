import { dev } from '$app/environment';
import { fail, redirect } from '@sveltejs/kit';

import { APP_ROLE_COOKIE, getRolePath, isAppRole } from '$lib/auth/roles';

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = ({ locals }) => {
	if (locals.user?.role) {
		throw redirect(307, getRolePath(locals.user.role));
	}

	return {};
};

export const actions = {
	login: async ({ request, cookies }) => {
		const data = await request.formData();
		const email = String(data.get('email') ?? '').trim();
		const password = String(data.get('password') ?? '').trim();
		const role = String(data.get('role') ?? '').trim();

		if (!email || !password || !isAppRole(role)) {
			return fail(400, {
				error: 'Email, password, dan role wajib diisi.',
				values: { email, role }
			});
		}

		cookies.set(APP_ROLE_COOKIE, role, {
			path: '/',
			httpOnly: true,
			sameSite: 'lax',
			secure: !dev,
			maxAge: 60 * 60 * 24 * 30
		});

		throw redirect(303, getRolePath(role));
	}
};
