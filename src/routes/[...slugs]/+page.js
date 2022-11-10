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
	const paramsSport = params.slugs.split('/')[0];

	// if sport is invalid, redirect to `/`
	if (!Object.keys(API_ENDPOINTS).includes(paramsSport)) {
		throw redirect(308, `/`);
	}

	// if url contains another param, go to the sport
	if (params.slugs.split('/')[1]) {
		throw redirect(308, `/${paramsSport}`);
	}

	const response = await fetch(
		`https://site.api.espn.com/apis/site/v2/sports${API_ENDPOINTS[paramsSport]}`
	);
	const data = await response.json();

	console.log(data);

	return { ...data };
}
