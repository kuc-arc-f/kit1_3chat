<svelte:head>
	<title>Posts</title>
	<meta name="description" content="About this app" />
</svelte:head>

<script lang="ts">
/** @type {import('./$types').PageData} */
export let data: any;
console.log(data);
/**
 * start proc
 * @param
 *
 * @return
 */ 
if(data.validLogin === false) {
	window.location.href = '/login';
}

</script>

<div class="container my-2">
	<h1>Chat</h1>
	<hr />
	<a href={`/chats/create`} class="btn btn-primary">Create
	</a>
  
	<hr />
	{#each data.items as item}
	<div>
		<h3>{item.name}</h3>
		<p>ID : {item.id}</p>
		<a href={`/chats/${item.id}`} class="btn btn-outline-primary">Show
		</a>		
		<hr />
	</div>
	{/each}	
</div>
<!-- 
<a href={`/chats/edit/${item.id}`} class="btn">[ Edit ]
</a>		
-->