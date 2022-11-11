<script>
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';

	export let data;

	$: params = $page.params.slugs.split('/');
	$: paramsSport = params[0];

	let currentPollIdx = 0;

	$: idx = currentPollIdx;
	$: ranks = data.rankings[idx]?.ranks ?? [];
	$: headline = data.rankings[idx]?.shortHeadline ?? [];
	$: others = data.rankings[idx]?.others ?? [];
	$: droppedOut = data.rankings[idx]?.droppedOut ?? [];

	$: maxVotes = ranks?.[0]?.points;
</script>

<svelte:head>
	<title>{headline ?? 'Sports Top 25'}</title>
</svelte:head>

<select
	value={paramsSport}
	on:change={({ target }) => goto(`/${target.value}`)}
	class="w-full text-gray-900 p-2 mb-2 font-bold"
>
	<option value="mens-college-basketball">Mens College Basketball</option>
	<option value="womens-college-basketball">Womens College Basketball</option>
	<option value="college-football">College Football</option>
	<!-- <option value="mlb-baseball">MLB Baseball</option>
	<option value="nba-basketball">NBA Basketball</option>
	<option value="wnba-basketball">WNBA Basketball</option>
	<option value="nfl-football">NFL Football</option> -->
</select>
<div class="flex items-center justify-between">
	{#each data.rankings as ranking, idx}
		<button
			on:click={() => {
				currentPollIdx = idx;
			}}
			class:active={currentPollIdx === idx}
		>
			{ranking.shortName}
		</button>
	{/each}
</div>

<h1 class="mt-4 mb-8 pb-2 text-center text-lg sm:text-xl md:text-2xl border-b">
	<img class="w-6 h-6 hidden xs:inline-block" src="/favicon.svg" alt="logo" />
	{headline}
</h1>

<table class="mx-auto w-full bg-gray-900 text-left">
	<tr>
		<th>Rank</th>
		<th>Team</th>
		{#if ranks[0].points !== 0}
			<th>Votes</th>
		{/if}
		<th>Trend</th>
	</tr>
	{#each ranks as ranking}
		<tr
			class="font-bold bg-no-repeat bg-center"
			style="background-image: url('{ranking.team.logo}');"
		>
			<td class="text-xl sm:text-3xl">{ranking.current}</td>
			<td>
				{#if ranking.team.logo}
					<img
						class="w-6 sm:w-8 md:w-10 mr-2 xs:inline"
						loading="lazy"
						src={ranking.team.logo}
						alt={ranking.team.name + ' logo'}
						width="500"
						height="500"
					/>
				{/if}
				<span class="tracking-wider">
					{ranking.team.nickname}
				</span>
			</td>
			{#if ranks[0].points !== 0}
				<td>
					{ranking.points}
					{#if ranking.firstPlaceVotes}
						({ranking.firstPlaceVotes})
					{/if}
					<div class="bg-white h-1" style="width:{(ranking.points / maxVotes) * 100}%" />
				</td>
			{/if}
			<td
				class={ranking.trend[0] === '+'
					? 'text-green-300'
					: ranking.trend === '-'
					? 'text-white'
					: 'text-red-300'}
			>
				{ranking.trend === '-' ? '\u2014' : ranking.trend}
			</td>
		</tr>
	{/each}
</table>

<p class="my-4">
	<b>Others receiving votes:</b>
	{others.map((other) => other.team.nickname).join(', ')}
</p>

<p class="my-4">
	<b>Dropped out:</b>
	{droppedOut.map((out) => out.team.nickname).join(', ')}
</p>

<footer class="mt-12">
	<hr />
	<small>
		Data from ESPN. SportsTop25.netlify.app designed by <a
			class="font-bold"
			href="https://justingolden.me/"
			target="_blank"
			rel="noreferrer">Justin Golden</a
		>
	</small>
</footer>

<style lang="postcss">
	td,
	th {
		@apply p-4 bg-gray-900/90;
	}
	th {
		@apply font-normal;
	}
	button {
		@apply w-full p-2 m-2 font-bold bg-gray-400 text-gray-900 hover:bg-gray-200 transition-colors first:ml-0 last:mr-0 text-sm md:text-lg self-stretch;
	}
	button.active {
		@apply bg-white;
	}
</style>
