<script>
  export let data;
</script>

<svelte:head>
    <title>Tris' Field - {data.title}</title>
</svelte:head>

<section class="section">
    <h1 class="title">{data.title}</h1>

    <table class="table is-fullwidth is-hoverable is-striped">
        <thead>
            <td>#</td>
            <td>Team</td>
            <td>Rating</td>
            <td>Games Played</td>
        </thead>
        <tbody>
            {#each data.teams as team, i}
                <tr>
                    <td>
                        {i+1}
                    </td>
                    <td>
                        <a href="/teams/{team.id}">{team.name}</a>
                    </td>
                    <td>
                        {team.rating}
                    </td>
                    <td>
                        {team.gamesPlayed}
                    </td>
                </tr>
            {/each}
        </tbody>

    </table>
</section>
