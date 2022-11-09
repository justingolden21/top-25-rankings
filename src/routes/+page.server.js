import { redirect } from '@sveltejs/kit';

export function load() {
	// redirect from `/` to `/mens-college-basketball/ap`
	throw redirect(308, '/mens-college-basketball/ap');
}
