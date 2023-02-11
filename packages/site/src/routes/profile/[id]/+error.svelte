<script>
    import { page } from '$app/stores';
    export let data;
</script>

<div class='content'>
    <h1>
        {$page.status}: {$page.error.message}
    </h1>
</div>