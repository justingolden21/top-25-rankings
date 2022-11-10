<script>
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';

	export let data;

	const POLL_TYPES = ['ap', 'coaches', 'fcs-coaches', 'div-ii-coaches'];

	$: params = $page.params.slugs.split('/');
	$: paramsSport = params[0];
	$: paramsPoll = params[1];

	$: idx = POLL_TYPES.indexOf(paramsPoll);
	$: ranks = data.rankings[idx]?.ranks ?? [];
	$: headline = data.rankings[idx]?.headline ?? [];
	$: others = data.rankings[idx]?.others ?? [];
	$: droppedOut = data.rankings[idx]?.droppedOut ?? [];

	$: maxVotes = ranks?.[0]?.points;
</script>

<svelte:head>
	<title>{headline ?? 'Sports Top 25'}</title>
</svelte:head>

<select
	value={paramsSport}
	on:change={({ target }) => goto(`/${target.value}/${paramsPoll}`)}
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
	<button
		on:click={() => {
			goto(`/${paramsSport}/ap`);
		}}
		class:active={paramsPoll === 'ap'}
	>
		AP
	</button>
	<button
		on:click={() => {
			goto(`/${paramsSport}/coaches`);
		}}
		class:active={paramsPoll === 'coaches'}
	>
		Coaches
	</button>
	{#if paramsSport === 'college-football'}
		<button
			on:click={() => {
				goto(`/${paramsSport}/fcs-coaches`);
			}}
			class:active={paramsPoll === 'fcs-coaches'}
		>
			FCS Coaches
		</button>
		<button
			on:click={() => {
				goto(`/${paramsSport}/div-ii-coaches`);
			}}
			class:active={paramsPoll === 'div-ii-coaches'}
		>
			DIV II Coaches
		</button>
	{/if}
</div>

<h1 class="mt-4 mb-8 pb-2 text-center text-lg sm:text-xl md:text-2xl border-b">{headline}</h1>

<table class="mx-auto w-full bg-gray-900 text-left">
	<tr>
		<th>Rank</th>
		<th>Team</th>
		<th>Votes</th>
		<th>Trend</th>
	</tr>
	{#each ranks as ranking}
		<tr
			class="font-bold bg-no-repeat bg-center"
			style="background-image: url('{ranking.team.logo}');"
		>
			<td class="text-xl sm:text-3xl">{ranking.current}</td>
			<td>
				<img
					class="w-6 sm:w-8 md:w-10 mr-2 xs:inline bg-white p-1"
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
				class={ranking.trend[0] === '+'
					? 'text-green-300'
					: ranking.trend === '-'
					? 'text-white'
					: 'text-red-300'}
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
