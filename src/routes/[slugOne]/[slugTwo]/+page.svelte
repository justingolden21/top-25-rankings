<script>
	import { page } from '$app/stores';
	console.log($page.params);

	import Rankings from '../../../Rankings.svelte';
</script>

<Rankings params={$page.params} />
