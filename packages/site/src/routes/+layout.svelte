<script>
    import { signIn, signOut } from '@auth/sveltekit/client';
    import { page } from '$app/stores';
</script>


<nav class="navbar">
	<div class="navbar-brand">
		<a class="navbar-item" href="/">
      		<img src="/logo.png" />
    	</a>
	</div>
	
	<div class="navbar-end">
		{#if $page.data.session}
			<span class="navbar-item">
				Signed in as&#160
				<strong>{$page.data.session.user.name}</strong>
			</span>
			<a class="button is-light navbar-item" on:click={() => signOut()} href='#'>Sign out</a>
		{:else}
			<a class="button is-light navbar-item" on:click={()=>signIn('discord')} href='#'>
				Log in with Discord
			</a>
		{/if}
	</div>
</nav>

