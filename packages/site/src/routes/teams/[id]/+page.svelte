<script>
    export let data;
</script>

<div class=content>
 
    <h1>{data.team.name}</h1>

    <h2>Captain</h2>
    <p>{data.captain_name}</p>

    <h2 class="subtitle">Members</h2>
    <ul>
        {#each data.team.players as player}
            <li>
                {player.name}
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