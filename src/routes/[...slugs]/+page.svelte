<script>
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';

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
	on:change={({ target }) => {
		currentPollIdx = 0;
		goto(`/${target.value}`);
	}}
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
<div class="flex items-center justify-between overflow-x-auto">
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
		{#each ranks as ranking}
			<tr
				class="font-bold bg-no-repeat bg-center"
				style="background-image: url('{ranking.team.logo}');"
			>
				<td class="text-xl sm:text-3xl">{ranking.current}</td>
				<td>
					{#if ranking.team.logo}
						<img
							class="w-6 sm:w-8 md:w-10 mr-2 xs:inline bg-white p-1"
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
				<td>{ranking.recordSummary}</td>
			</tr>
		{/each}
	</table>
</div>

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
			href="https://justingolden.me/"
			target="_blank"
			rel="noreferrer">Justin Golden</a
		>
	</small>
</footer>

<div class="grid grid-cols-5">
	{#each ranks as ranking, idx}
		<div
			class="relative bg-no-repeat bg-center bg-white w-32 h-32"
			style="background-image: url('{ranking.team.logo}'); "
		>
			<div class="bg-white/75 px-1 py-4 w-full h-full text-gray-900">
				<div
					class="absolute top-0 left-0 font-bold flex justify-center items-center w-6 h-6 text-xl bg-white"
				>
					{idx + 1}
				</div>
				<img class="w-12 block bg-white p-1" src={ranking.team.logo} alt="" />
				<p class="font-bold">
					{ranking.team.nickname}
				</p>
				<p class="text-sm">
					{ranking.team.name}
				</p>
			</div>
		</div>
	{/each}
</div>

<br />
<br />

<div class="grid grid-cols-5">
	{#each ranks as ranking, idx}
		<div
			class="relative bg-no-repeat bg-center bg-cover bg-white w-32 h-32"
			style="background-image: url('{ranking.team.logo}'); "
		>
			<div class="bg-white/75 px-1 py-4 w-full h-full text-gray-900 font-bold">
				<div
					class="absolute top-0 left-0 flex justify-center items-center w-6 h-6 text-xl bg-white"
				>
					{idx + 1}
				</div>
				<img
					class="absolute top-0 right-0 w-12 block bg-white p-1"
					src={ranking.team.logo}
					alt=""
				/>
				<br />
				<p class="font-bold">
					{ranking.team.nickname}
				</p>
				<p class="text-sm">
					{ranking.team.name}
				</p>
			</div>
		</div>
	{/each}
</div>

<br />
<br />

<div class="grid grid-cols-5">
	{#each ranks as ranking, idx}
		<div
			class="relative bg-no-repeat bg-center bg-cover w-32 h-32"
			style="background-image: url('{ranking.team.logo}'); background-color: #{ranking.team.color};"
		>
			<div class="bg-white/90 px-1 py-4 w-full h-full text-gray-900 font-bold">
				<div
					class="absolute top-0 left-0 flex justify-center items-center w-6 h-6 text-xl bg-white"
				>
					{idx + 1}
				</div>
				<img class="mx-auto w-12 block" src={ranking.team.logo} alt="" />
				<p class="text-center text-md">
					{ranking.team.nickname}
				</p>
				<p class="text-center text-sm">
					{ranking.team.name}
				</p>
			</div>
		</div>
	{/each}
</div>

<br />
<br />

<div class="grid grid-cols-5">
	{#each ranks as ranking, idx}
		<div
			class="relative bg-no-repeat bg-center bg-cover w-32 h-32 bg-white border-2 border-x-4 border-gray-100"
			style="background-image: url('{ranking.team.logo}');"
		>
			<div
				class="bg-white/75 w-full h-full text-gray-900 font-bold flex items-center justify-center"
			>
				<div class="absolute top-0 left-0 flex justify-center items-center w-6 h-6 text-xl">
					{idx + 1}
				</div>
				<div class="bg-white/50 p-1 w-full">
					<p class="mt-2 text-center text-lg">
						{ranking.team.nickname}
					</p>
					<p class="text-center text-md">
						{ranking.team.name}
					</p>
				</div>
			</div>
		</div>
	{/each}
</div>

<br />
<br />

<div class="grid grid-cols-5">
	{#each ranks as ranking, idx}
		<div
			class="relative bg-no-repeat bg-center bg-cover w-32 h-32 bg-white border-2 border-x-4 border-gray-100"
			style="background-image: url('{ranking.team.logo}');"
		>
			<div
				class="w-full h-full text-gray-900 font-bold flex items-center justify-center"
				style="background-color: #{ranking.team.color}33;"
			>
				<div class="absolute top-0 left-0 flex justify-center items-center w-6 h-6 text-xl">
					{idx + 1}
				</div>
				<div class="bg-white/75 p-1 w-full">
					<p class="mt-2 text-center text-lg">
						{ranking.team.nickname}
					</p>
					<p class="text-center text-md">
						{ranking.team.name}
					</p>
				</div>
			</div>
		</div>
	{/each}
</div>

<br />
<br />

<div class="grid grid-cols-5">
	{#each ranks as ranking, idx}
		<div
			class="relative bg-no-repeat bg-center bg-cover w-32 h-32 bg-white border-2 border-x-4 border-gray-100"
			style="background-image: url('{ranking.team.logo}');"
		>
			<div class="w-full h-full text-gray-900 font-bold flex items-center justify-center">
				<div
					class="absolute top-0 left-0 bg-white/75 p-1 flex justify-center items-center w-6 h-6 text-xl"
				>
					{idx + 1}
				</div>
				<p class="bg-white/75 w-full text-center text-xl">{ranking.team.nickname}</p>
			</div>
		</div>
	{/each}
</div>

<br />
<br />

<div class="grid grid-cols-5">
	{#each ranks as ranking, idx}
		<div
			class="relative bg-no-repeat bg-center bg-cover w-32 h-32 bg-white border-2 border-x-4 border-gray-100 text-gray-900 font-bold"
			style="background-image: url('{ranking.team.logo}');"
		>
			<div
				class="absolute top-0 left-0 bg-white/75 p-1 flex justify-center items-center w-8 h-8 text-2xl"
			>
				{idx + 1}
			</div>
			<p
				class="absolute bottom-0 bg-white/75 w-full h-1/2 p-1 flex items-center justify-center text-center text-xl"
			>
				{ranking.team.nickname}
			</p>
		</div>
	{/each}
</div>

<br />
<br />

<div class="grid grid-cols-5">
	{#each ranks as ranking, idx}
		<div
			class="relative bg-no-repeat bg-center bg-cover w-32 h-32 bg-white border-2 border-x-4 border-gray-900 text-gray-900 font-bold"
			style="background-image: url('{ranking.team.logo}');"
		>
			<div
				class="absolute top-0 left-0 bg-white/75 backdrop-blur-sm shadow p-1 flex justify-center items-center w-8 h-8 text-2xl"
			>
				{idx + 1}
			</div>
			<p
				class="absolute bottom-0 bg-white/75 backdrop-blur-sm shadow w-full h-1/2 p-1 flex items-center justify-center text-center text-xl"
			>
				{ranking.team.nickname}
			</p>
		</div>
	{/each}
</div>

<style lang="postcss">
	td,
	th {
		@apply p-4 bg-gray-900/90;
	}
	th {
		@apply font-normal text-xs md:text-sm;
	}
	button {
		@apply w-full p-2 m-2 font-bold bg-gray-400 text-gray-900 hover:bg-gray-200 transition-colors first:ml-0 last:mr-0 text-sm md:text-lg self-stretch;
	}
	button.active {
		@apply bg-white;
	}
	a {
		@apply font-bold hover:underline;
	}
</style>
