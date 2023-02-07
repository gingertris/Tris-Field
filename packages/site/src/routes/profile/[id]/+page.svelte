<script>
    export let data;
</script>

<div class=content>
 
    <h1>{data.player.name}</h1>


    <h2>Region</h2>
    <p>{data.player.region} </p>



    <h2>Division</h2>
    <p>
        {data.player.division}
    </p>

    <h2>Team</h2>
    <p>
        <a href="/teams/{data.player.team.id}">{data.player.team.name}</a>
    </p>


</div>