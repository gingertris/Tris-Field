<script>
    import { signIn, signOut } from '@auth/sveltekit/client';
    import { page } from '$app/stores';
</script>


<nav class="navbar">
	<div class="navbar-brand">
		<a class="navbar-item" href="/">
      		<img src="/logo.png" alt="Tris' field logo"/>
    	</a>
		<a class="navbar-item" href="/">
      		<span>Tris' Field</span>
    	</a>
		
	</div>

	<div class="navbar-menu">
		<div class="navbar-start">
			<div class="navbar-item has-dropdown is-hoverable">
				<a class='navbar-link'>EU</a>
				<div class='navbar-dropdown'>
					<a class="navbar-item" href="/leaderboards/eu/open">Open Division</a>
					<a class="navbar-item" href="/leaderboards/eu/closed">Closed Division</a>
				</div>
			</div>
			<div class="navbar-item has-dropdown is-hoverable">
				<a class='navbar-link'>NA</a>
				<div class='navbar-dropdown'>
					<a class="navbar-item" href="/leaderboards/na/open">Open Division</a>
					<a class="navbar-item" href="/leaderboards/na/closed">Closed Division</a>
				</div>
			</div>
		</div>
	</div>
	
	<div class="navbar-end">
		{#if $page.data.session}
			<div class="navbar-item">
				<a href="/profile/{$page.data.session.user.id}">Signed in as&#160
				<strong>{$page.data.session.user.name}</strong>
				</a>
			</div>
			<div class="navbar-item">
				<a class="button is-primary" on:click={() => signOut()}>Sign out</a>
			</div>
			
		{:else}
			<a class="button is-primary navbar-item" on:click={()=>signIn('discord')}>
				Log in with Discord
			</a>
		{/if}
	</div>
</nav>

<slot />
