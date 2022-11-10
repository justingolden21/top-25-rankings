import { redirect } from '@sveltejs/kit';

const API_ENDPOINTS = {
	'mens-college-basketball': '/basketball/mens-college-basketball/rankings',
	'womens-college-basketball': '/basketball/womens-college-basketball/rankings',
	'college-football': '/football/college-football/rankings'
	// 'mlb-baseball': '/baseball/mlb/rankings',
	// 'nba-basketball': '/basketball/nba/rankings',
	// 'wnba-basketball': '/basketball/wnba/rankings',
	// 'nfl-football': '/football/nfl/rankings'
};

export async function load({ params }) {
	const [paramsSport, paramsPoll] = params.slugs.split('/');

	// if sport is invalid, redirect to `/`
	if (!Object.keys(API_ENDPOINTS).includes(paramsSport)) {
		throw redirect(308, `/`);
	}

	// if poll is invalid, go to `/sport/ap`
	if (!['ap', 'coaches', 'fcs-coaches', 'div-ii-coaches', 'div-iii-coaches'].includes(paramsPoll)) {
		throw redirect(308, `/${paramsSport}/ap`);
	}
	// if poll is invalid for the sport, go to `/sport/ap`
	else if (
		(paramsPoll === 'fcs-coaches' ||
			paramsPoll === 'div-ii-coaches' ||
			paramsPoll === 'div-iii-coaches') &&
		paramsSport !== 'college-football'
	) {
		throw redirect(308, `/${paramsSport}/ap`);
	}

	const response = await fetch(
		`https://site.api.espn.com/apis/site/v2/sports${API_ENDPOINTS[paramsSport]}`
	);
	const data = await response.json();

	return { ...data };
}
