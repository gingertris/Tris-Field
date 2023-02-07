<script>
    import { page } from '$app/stores';
    export let data;
</script>

<div class='content'>
    <h1>
        {$page.status}: {$page.error.message}
    </h1>

    {#if $page.data.session.user.id == $page.error.id}
        <p>We notice you are logged in as the player you are currently trying to view the profile of. Are you in the Discord server, and registered to play?       
        </p>
    {/if}

</div>