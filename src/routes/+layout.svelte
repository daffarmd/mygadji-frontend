<script>
	import './layout.css';

	/** @type {{children: import('svelte').Snippet}} */
	let { children } = $props();
</script>

<svelte:head>
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
	<link
		href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Manrope:wght@500;600;700;800&family=Material+Symbols+Outlined:wght@200..700&display=swap"
		rel="stylesheet"
	/>
	<link rel="icon" type="image/png" href="/favicon.png?v=20260401c" />
	<link rel="apple-touch-icon" href="/favicon.png?v=20260401c" />
	<meta name="theme-color" content="#f6f8fc" />
</svelte:head>

{@render children()}
