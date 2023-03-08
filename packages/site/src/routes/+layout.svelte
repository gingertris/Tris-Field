<script>
	export let data;
</script>


<nav class="navbar">
	<div class="navbar-brand">
		<a class="navbar-item" href="/">
	
			<img src="/logo.png" alt="The Pitch logo"/>

			<span class="navbar-item" href="#">
				{data.title}
			</span>
		</a>


	</div>

	<div class="navbar-menu is-active">
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
	
</nav>

<slot />
