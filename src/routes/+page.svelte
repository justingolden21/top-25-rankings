<script>
	import { onMount } from 'svelte';

	// https://gist.github.com/akeaswaran/b48b02f1c94f873c6655e7129910fc3b
	// https://www.espn.com/apis/devcenter/docs/rankings.html

	const API_ENDPOINTS = {
		'mens college basketball': '/basketball/mens-college-basketball/rankings',
		'womens college basketball': '/basketball/womens-college-basketball/rankings',
		'college football': '/football/college-football/rankings'
		// 'mlb baseball': '/baseball/mlb/rankings',
		// 'nba basketball': '/basketball/nba/rankings',
		// 'wnba basketball': '/basketball/wnba/rankings',
		// 'nfl football': '/football/nfl/rankings'
	};

	const POLL_TYPES = ['ap', 'coaches', 'fcs coaches', 'div ii coaches'];

	function getData() {
		fetch(`https://site.api.espn.com/apis/site/v2/sports${API_ENDPOINTS[sport]}`)
			.then((response) => {
				if (response.ok) return response.json();
				return Promise.reject(response);
			})
			.then(function (data) {
				console.log('success');
				const idx = POLL_TYPES.indexOf(pollType);
				console.log(data);
				ranks = data.rankings[idx].ranks;
				headline = data.rankings[idx].headline;
				others = data.rankings[idx].others;
				droppedOut = data.rankings[idx].droppedOut;
			})
			.catch(function (err) {
				console.warn(err);
			});
	}

	onMount(getData);

	let ranks = [],
		headline = '',
		others = [],
		droppedOut = [];

	let pollType = 'ap';
	let sport = 'college football';

	$: maxVotes = ranks[0]?.points;
</script>

<svelte:head>
	<title>{headline ?? 'College Football Rankings'}</title>
</svelte:head>

<select
	bind:value={sport}
	on:change={() => {
		if (sport !== 'college football' && pollType !== 'ap' && pollType !== 'coaches') {
			pollType = 'ap';
		}
		getData();
	}}
	class="w-full text-gray-900 p-2 mb-2"
>
	<option value="mens college basketball">Mens College Basketball</option>
	<option value="womens college basketball">Womens College Basketball</option>
	<option value="college football">College Football</option>
	<!-- <option value="mlb baseball">MLB Baseball</option>
	<option value="nba basketball">NBA Basketball</option>
	<option value="wnba basketball">WNBA Basketball</option>
	<option value="nfl football">NFL Football</option> -->
</select>
<div class="flex items-center justify-between">
	<button
		on:click={() => {
			pollType = 'ap';
			getData();
		}}
		class:active={pollType === 'ap'}
	>
		AP
	</button>
	<button
		on:click={() => {
			pollType = 'coaches';
			getData();
		}}
		class:active={pollType === 'coaches'}
	>
		Coaches
	</button>
	{#if sport === 'college football'}
		<button
			on:click={() => {
				pollType = 'fcs coaches';
				getData();
			}}
			class:active={pollType === 'fcs coaches'}
		>
			FCS Coaches
		</button>
		<button
			on:click={() => {
				pollType = 'div ii coaches';
				getData();
			}}
			class:active={pollType === 'div ii coaches'}
		>
			DIV II Coaches
		</button>
	{/if}
</div>

<h1 class="mt-4 mb-8 pb-2 text-center text-xl sm:text-2xl md:text-3xl border-b">{headline}</h1>

<table class="mx-auto w-full bg-gray-900 text-left">
	<tr>
		<th>Rank</th>
		<th>Team</th>
		<th>Votes</th>
		<th>Trend</th>
	</tr>
	{#each ranks as ranking}
		<tr class="odd:bg-gray-800">
			<td class="font-bold sm:text-3xl">{ranking.current}</td>
			<td>
				<img
					class="inline w-6 sm:w-8 md:w-10 mr-2"
					loading="lazy"
					src={ranking.team.logo}
					alt={ranking.team.name + ' logo'}
					width="500"
					height="500"
				/>
				<span class="tracking-wider">
					{ranking.team.nickname}
				</span>
			</td>
			<td>
				{ranking.points}
				{#if ranking.firstPlaceVotes}
					({ranking.firstPlaceVotes})
				{/if}
				<div class="bg-white h-1" style="width:{(ranking.points / maxVotes) * 100}%" />
			</td>
			<td
				class="font-bold {ranking.trend[0] === '+'
					? 'text-green-300'
					: ranking.trend === '-'
					? 'text-white'
					: 'text-red-300'}"
			>
				{ranking.trend}
			</td>
		</tr>
	{/each}
</table>

<p class="my-4">
	<b>Others receiving votes:</b>
	{#each others as other}
		{other.team.nickname}
		{other.points},&nbsp;
	{/each}
</p>

<p class="my-4">
	<b>Dropped out:</b>
	{#each droppedOut as out}
		{out.team.nickname},
	{/each}
</p>

<style lang="postcss">
	td,
	th {
		@apply p-4;
	}
	th {
		@apply font-normal;
	}
	button {
		@apply w-full p-2 m-2 font-bold bg-gray-400 text-gray-900 hover:bg-gray-200 transition-colors first:ml-0 last:mr-0;
	}
	button.active {
		@apply bg-white;
	}
</style>
