<script>
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { flip } from 'svelte/animate';

	export let data;

	$: params = $page.params.slugs.split('/');
	$: paramsSport = params[0];

	let currentPollIdx = 0;

	$: idx = currentPollIdx;
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
	class="mb-4"
	on:change={({ target }) => {
		currentPollIdx = 0;
		goto(`/${target.value}`);
	}}
>
	<option value="mens-college-basketball">Mens College Basketball</option>
	<option value="womens-college-basketball">Womens College Basketball</option>
	<option value="college-football">College Football</option>
	<!-- <option value="mlb-baseball">MLB Baseball</option>
	<option value="nba-basketball">NBA Basketball</option>
	<option value="wnba-basketball">WNBA Basketball</option>
	<option value="nfl-football">NFL Football</option> -->
</select>
<div class="flex items-center justify-between overflow-x-auto">
	{#each data.rankings as ranking, idx}
		<button on:click={() => (currentPollIdx = idx)} class:active={currentPollIdx === idx}>
			{ranking.shortName}
		</button>
	{/each}
</div>

<h1 class="my-4 pb-2 text-center text-base sm:text-lg md:text-xl border-b">
	<img class="w-6 h-6 hidden xs:inline-block" src="/favicon.svg" alt="logo" />
	{headline}
</h1>

<div class="overflow-x-auto">
	<table class="mx-auto w-full bg-gray-900 text-left">
		<tr>
			<th>Rank</th>
			<th>Team</th>
			{#if ranks[0].points !== 0}
				<th>Votes</th>
			{/if}
			<th>Trend</th>
			<th>Record</th>
		</tr>
		{#key paramsSport}
			{#each ranks as ranking (ranking.team.nickname)}
				<tr
					class="font-bold bg-no-repeat bg-center"
					style="background-image: url('{ranking.team.logo}');"
					animate:flip={{ duration: 500 }}
				>
					<td class="text-xl sm:text-3xl">{ranking.current}</td>
					<td>
						{#if ranking.team.logo}
							<img
								class="w-6 xs:w-8 sm:w-10 md:w-12 mr-2 xs:inline bg-white rounded p-1"
								loading="lazy"
								src={ranking.team.logo}
								alt={ranking.team.name + ' logo'}
								width="500"
								height="500"
							/>
						{/if}

						{#if ranking.team.links.length > 0}
							<a href={ranking.team.links[0]?.href} target="_blank" rel="noreferrer">
								{ranking.team.nickname}
							</a>
						{:else}
							{ranking.team.nickname}
						{/if}
					</td>
					{#if ranks[0].points !== 0}
						<td>
							{ranking.points}
							{#if ranking.firstPlaceVotes}
								({ranking.firstPlaceVotes})
							{/if}
							<div
								class="bg-white h-1 transition-[width]"
								style="width:{(ranking.points / maxVotes) * 100}%"
							/>
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
					<td>{ranking.recordSummary}</td>
				</tr>
			{/each}
		{/key}
	</table>
</div>

{#if others.length > 0}
	<p class="my-4">
		<span class="mr-2">Others receiving votes:</span>
		{#each others as other, i}
			{#if other.team.links.length > 0}
				<a href={other.team.links[0]?.href} target="_blank" rel="noreferrer">
					{other.team.nickname}
				</a>
				<span>({other.points})</span>
			{:else}
				{other.team.nickname}
			{/if}
			{#if i < others.length - 1}
				|&nbsp;
			{/if}
		{/each}
	</p>
{/if}

{#if droppedOut.length > 0}
	<p class="my-4">
		<span class="mr-2">Dropped out:</span>
		{#each droppedOut as out, i}
			{#if out.team.links.length > 0}
				<a href={out.team.links[0]?.href} target="_blank" rel="noreferrer">{out.team.nickname}</a>
				<span>({out.points})</span>
			{:else}
				{out.team.nickname}
			{/if}
			{#if i < droppedOut.length - 1}
				|&nbsp;
			{/if}
		{/each}
	</p>
{/if}

<div class="flex">
	<button
		on:click={() => {
			navigator?.share({
				title: headline,
				text: `Check out the top 25 ${
					paramsSport === 'college-football' ? 'football' : 'basketball'
				} rankings`,
				url: window.location.href
			});
		}}
	>
		Share
	</button>
	<button on:click={() => window.print()}> Print </button>
</div>

<footer class="mt-12">
	<hr />
	<small>
		Data from ESPN. Website designed by <a
			href="https://justingolden.me/"
			target="_blank"
			rel="noreferrer">Justin Golden</a
		>
	</small>
</footer>

<style lang="postcss">
	td,
	th {
		@apply p-2 print:py-0 sm:py-4 bg-gray-900/90;
	}
	th {
		@apply font-normal text-xs md:text-sm;
	}
	button,
	select {
		@apply w-full p-1 md:p-2 text-gray-900 font-bold text-sm md:text-base rounded print:hidden;
	}
	button {
		@apply mx-2 bg-gray-400 hover:bg-white transition-colors first:ml-0 last:mr-0 self-stretch;
	}
	button.active {
		@apply bg-white;
	}
	a {
		@apply font-bold hover:underline;
	}
</style>
