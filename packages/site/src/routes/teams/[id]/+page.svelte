<script>
    export let data;
</script>

<svelte:head>
    <title>Tris' Field - {data.team.name}</title>
</svelte:head>

<div class=content>
 
    <h1>{data.team.name}</h1>

    <h2 class="subtitle">Members</h2>
    <ul>
        {#each data.team.players as player}
            <li>
                <a href="/profile/{player.id}">{player.name} <b>{player.id == data.team.captainId ? "(C)" : ""}</b></a>
            </li>
        {/each}
    </ul>

    <h2>Region</h2>
    <p>{data.team.region} </p>



    <h2>Division</h2>
    <p>
        {data.team.division}
    </p>


    
    <h2>Rating</h2>
    <p>
        {data.team.rating}
    </p>


</div>